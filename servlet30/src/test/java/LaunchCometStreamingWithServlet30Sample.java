import org.testatoo.container.ContainerConfiguration;
import org.testatoo.container.TestatooContainer;

final class LaunchCometStreamingWithServlet30Sample {
    public static void main(String[] args) throws Exception {
        ContainerConfiguration.create().buildContainer(TestatooContainer.JETTY).start();
    }
}
