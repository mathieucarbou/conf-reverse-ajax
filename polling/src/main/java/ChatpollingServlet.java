import org.codehaus.jettison.json.JSONArray;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author Mathieu Carbou (mathieu.carbou@gmail.com)
 */
public final class ChatpollingServlet extends HttpServlet {

    private final Broadcaster broadcaster = new Broadcaster();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String paramUser = req.getParameter("user");
        if (paramUser != null) {
            req.getSession().setAttribute("user", paramUser);
            broadcaster.connect(req);
        }

        String message = req.getParameter("msg");
        if (message != null) {
            broadcaster.broadcast(req, message);
            resp.setStatus(HttpServletResponse.SC_OK);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String user = (String) req.getSession().getAttribute("user");

        if (user == null) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "No user in session");

        } else {
            JSONArray list = broadcaster.readMessages(req);
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            resp.getWriter().write(list.toString());
            resp.getWriter().flush();
        }
    }
}
