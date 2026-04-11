import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class MyServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String name = request.getParameter("name");
        String age = request.getParameter("age");

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        out.println("<html><body>");

        try {
            int a = Integer.parseInt(age);
            out.println("<h2>Hello, " + name + "! You are " + a + " years old.</h2>");
        } catch (Exception e) {
            out.println("<h2>Invalid age!</h2>");
        }

        out.println("</body></html>");
    }
}