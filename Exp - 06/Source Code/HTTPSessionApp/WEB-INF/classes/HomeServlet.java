import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class HomeServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        if (session != null && session.getAttribute("username") != null) {

            String user = (String) session.getAttribute("username");

            out.println("<h2>Welcome " + user + "</h2>");
            out.println("<a href='logout'>Logout</a>");

        } else {
            response.sendRedirect("index.html");
        }
    }
}