import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.eclipse.jetty.continuation.Continuation;
import org.eclipse.jetty.continuation.ContinuationSupport;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * @author Mathieu Carbou (mathieu.carbou@gmail.com)
 */
public final class ChatCometLongPollingServlet extends HttpServlet {

    final Queue<Continuation> continuations = new ConcurrentLinkedQueue<Continuation>();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String paramUser = req.getParameter("user");
        if (paramUser != null) {
            req.getSession().setAttribute("user", paramUser);
        }

        String message = req.getParameter("msg");
        String user = (String) req.getSession().getAttribute("user");
        if (message != null && user != null) {
            try {
                String msg = new JSONArray().put(new JSONObject()
                        .put("from", user + " (" + req.getRemoteHost() + ":" + req.getRemotePort() + ")")
                        .put("at", System.currentTimeMillis())
                        .put("msg", message))
                        .toString();

                while (!continuations.isEmpty()) {
                    Continuation continuation = continuations.poll();

                    HttpServletResponse peer = (HttpServletResponse) continuation.getServletResponse();
                    peer.setStatus(HttpServletResponse.SC_OK);
                    peer.setContentType("application/json");
                    peer.getWriter().write(msg);

                    continuation.complete();
                }
                resp.setStatus(HttpServletResponse.SC_OK);
            } catch (JSONException e) {
                throw new RuntimeException(e.getMessage(), e);
            }
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String user = (String) req.getSession().getAttribute("user");
        if (user == null) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "No user in session");

        } else {
            Continuation continuation = ContinuationSupport.getContinuation(req);
            continuation.setTimeout(0);
            continuation.suspend();
            continuations.offer(continuation);
        }
    }
}
