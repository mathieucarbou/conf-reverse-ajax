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
public final class ChatCometStreamingServlet extends HttpServlet {

    final Queue<Continuation> continuations = new ConcurrentLinkedQueue<Continuation>();
    final String boundary = "ABCDEFGHIJKLMNOPQRST"; // generated

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
                JSONObject msg = new JSONObject()
                        .put("from", user + " (" + req.getRemoteHost() + ":" + req.getRemotePort() + ")")
                        .put("at", System.currentTimeMillis())
                        .put("msg", message);

                for (Continuation continuation : continuations) {

                    HttpServletResponse peer = (HttpServletResponse) continuation.getServletResponse();
                    peer.getOutputStream().println("Content-Type: application/json");
                    peer.getOutputStream().println();
                    peer.getOutputStream().println();
                    peer.getOutputStream().println(new JSONArray().put(msg).toString());
                    peer.getOutputStream().println("--" + boundary);
                    peer.flushBuffer();

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
            continuation.suspend();
            continuations.offer(continuation);

            resp.setContentType("multipart/x-mixed-replace;boundary=\"" + boundary + "\"");
            resp.setHeader("Connection", "keep-alive");
            resp.getOutputStream().print("--" + boundary);
            resp.flushBuffer();
        }
    }
}
