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

        // a user is connecting
        if (paramUser != null) {
            req.getSession().setAttribute("user", paramUser);
            broadcaster.connect(req);
            System.out.println("User connected: " + paramUser);
        }

        String message = req.getParameter("msg");
        if (message != null) {
            System.out.println("Broadcasting message: " + message);
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
            System.out.println("Reading messages for user : " + user);
            JSONArray list = broadcaster.readMessages(req);
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            resp.getWriter().write(list.toString());
            resp.getWriter().flush();
        }
    }
}
