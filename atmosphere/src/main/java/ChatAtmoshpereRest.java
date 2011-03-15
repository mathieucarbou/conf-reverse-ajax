import org.atmosphere.annotation.Broadcast;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.cpr.DefaultBroadcaster;
import org.atmosphere.jersey.Broadcastable;
import org.atmosphere.jersey.SuspendResponse;
import org.codehaus.jettison.json.JSONArray;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

@Path("/")
@Produces("application/json")
public class ChatAtmoshpereRest {

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
    public Broadcastable publish(JSONArray messages) {
        Broadcaster broadcaster = BroadcasterFactory.getDefault().lookup(DefaultBroadcaster.class, "chatroom", true);
        return new Broadcastable(messages, "", broadcaster);
    }
}
