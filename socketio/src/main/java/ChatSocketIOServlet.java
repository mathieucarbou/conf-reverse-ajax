import com.glines.socketio.common.DisconnectReason;
import com.glines.socketio.common.SocketIOException;
import com.glines.socketio.server.SocketIOInbound;
import com.glines.socketio.server.SocketIOOutbound;
import com.glines.socketio.server.SocketIOServlet;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * @author Mathieu Carbou (mathieu.carbou@gmail.com)
 */
public final class ChatSocketIOServlet extends SocketIOServlet {

    final Queue<SocketIOOutbound> outbounds = new ConcurrentLinkedQueue<SocketIOOutbound>();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String paramUser = req.getParameter("user");
        if (paramUser != null) {
            // user register its name
            req.getSession().setAttribute("user", paramUser);
        } else {
            // socket.io posts a message
            super.doPost(req, resp);
        }
    }

    @Override
    protected SocketIOInbound doSocketIOConnect(HttpServletRequest request) {

        String user = (String) request.getSession().getAttribute("user");
        final String from = user + " (" + request.getRemoteHost() + ":" + request.getRemotePort() + ")";

        return new SocketIOInbound() {

            private SocketIOOutbound outbound;

            @Override
            public void onConnect(SocketIOOutbound outbound) {
                this.outbound = outbound;
                outbounds.offer(outbound);
                try {
                    outbound.sendMessage("");
                } catch (SocketIOException e) {
                    outbound.disconnect();
                }
            }

            @Override
            public void onDisconnect(DisconnectReason reason, String errorMessage) {
                outbounds.remove(outbound);
                outbound = null;
            }

            @Override
            public void onMessage(int messageType, String message) {
                try {
                    String msg = new JSONArray().put(new JSONObject()
                            .put("from", from)
                            .put("at", System.currentTimeMillis())
                            .put("msg", message))
                            .toString();
                    for (SocketIOOutbound outbound : outbounds) {
                        try {
                            outbound.sendMessage(msg);
                        } catch (SocketIOException e) {
                            outbounds.remove(outbound);
                            outbound.disconnect();
                        }
                    }
                } catch (JSONException e) {
                    throw new RuntimeException(e.getMessage(), e);
                }
            }
        };
    }

}
