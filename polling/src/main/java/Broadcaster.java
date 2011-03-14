import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;
import java.util.Queue;
import java.util.WeakHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * @author Mathieu Carbou (mathieu.carbou@gmail.com)
 */
final class Broadcaster {

    final Map<HttpSession, Queue<JSONObject>> messages = new WeakHashMap<HttpSession, Queue<JSONObject>>();

    void connect(HttpServletRequest req) {
        if (!messages.containsKey(req.getSession()))
            messages.put(req.getSession(), new ConcurrentLinkedQueue<JSONObject>());
    }

    void broadcast(HttpServletRequest req, String message) {
        try {
            JSONObject msg = new JSONObject()
                    .put("from", req.getSession().getAttribute("user"))
                    .put("at", System.currentTimeMillis())
                    .put("msg", message);
            for (Queue<JSONObject> queue : messages.values())
                queue.offer(msg);
        } catch (JSONException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    JSONArray readMessages(HttpServletRequest req) {
        JSONArray array = new JSONArray();
        Queue<JSONObject> queue = messages.get(req.getSession());
        if (queue != null) {
            while (!queue.isEmpty()) {
                array.put(queue.poll());
            }
        }
        return array;
    }
}
