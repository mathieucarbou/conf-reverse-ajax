import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.eclipse.jetty.websocket.WebSocket;
import org.eclipse.jetty.websocket.WebSocketServlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * @author Mathieu Carbou (mathieu.carbou@gmail.com)
 */
public final class ChatWebSocketServlet extends WebSocketServlet {

    final Queue<WebSocket.Outbound> outbounds = new ConcurrentLinkedQueue<WebSocket.Outbound>();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String paramUser = req.getParameter("user");
        if (paramUser != null) {
            req.getSession().setAttribute("user", paramUser);
        }
    }

    @Override
    protected WebSocket doWebSocketConnect(HttpServletRequest request, String protocol) {

        String user = (String) request.getSession().getAttribute("user");
        final String from = user + " (" + request.getRemoteHost() + ":" + request.getRemotePort() + ")";

        return new WebSocket() {

            private Outbound outbound;

            @Override
            public void onConnect(Outbound outbound) {
                this.outbound = outbound;
                outbounds.offer(outbound);
            }

            @Override
            public void onDisconnect() {
                outbounds.remove(outbound);
            }

            @Override
            public void onMessage(byte opcode, String data) {

                try {
                    String msg = new JSONArray().put(new JSONObject()
                            .put("from", from)
                            .put("at", System.currentTimeMillis())
                            .put("msg", data))
                            .toString();
                    for (Outbound outbound : outbounds) {
                        try {
                            outbound.sendMessage(msg);
                        } catch (IOException e) {
                            outbounds.remove(outbound);
                            outbound.disconnect();
                        }
                    }
                } catch (JSONException e) {
                    throw new RuntimeException(e.getMessage(), e);
                }
            }

            @Override
            public void onFragment(boolean more, byte opcode, byte[] data, int offset, int length) {
                try {
                    onMessage(opcode, new String(data, offset, length, "UTF-8"));
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e.getMessage(), e);
                }
            }

            @Override
            public void onMessage(byte opcode, byte[] data, int offset, int length) {
                try {
                    onMessage(opcode, new String(data, offset, length, "UTF-8"));
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e.getMessage(), e);
                }
            }
        };
    }
}
