import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class HelloServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html");

        PrintWriter out = response.getWriter();

        out.println("<html><body>");
        out.println("<h2>Hello, World!</h2>");
        out.println("</body></html>");
    }
}