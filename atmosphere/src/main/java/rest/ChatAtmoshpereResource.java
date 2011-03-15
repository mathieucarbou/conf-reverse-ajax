package rest;

import org.atmosphere.annotation.Broadcast;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.cpr.DefaultBroadcaster;
import org.atmosphere.jersey.Broadcastable;
import org.atmosphere.jersey.SuspendResponse;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

@Path("/chatroom")
@Produces("application/json")
public class ChatAtmoshpereResource {

    @GET
    public SuspendResponse<String> subscribe() {
        Broadcaster broadcaster = BroadcasterFactory.getDefault().lookup(DefaultBroadcaster.class, "chatroom", true);
        return new SuspendResponse.SuspendResponseBuilder<String>()
                .broadcaster(broadcaster)
                .outputComments(true)
                .build();
    }

    @POST
    @Broadcast
    public Broadcastable publish(String message, @Context HttpServletRequest request) throws JSONException {
        Broadcaster broadcaster = BroadcasterFactory.getDefault().lookup(DefaultBroadcaster.class, "chatroom", true);
        String user = (String) request.getSession().getAttribute("user");
        String msg = new JSONArray().put(new JSONObject()
                .put("from", user + " (" + request.getRemoteHost() + ":" + request.getRemotePort() + ")")
                .put("at", System.currentTimeMillis())
                .put("msg", message))
                .toString();
        return new Broadcastable(msg, "", broadcaster);
    }
}
