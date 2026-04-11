import java.io.IOException;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        if ("admin".equals(username) && "1234".equals(password)) {

            HttpSession session = request.getSession();
            session.setAttribute("username", username);

            response.sendRedirect("home");

        } else {
            response.setContentType("text/html");
            response.getWriter().println("<h3>Invalid Login</h3>");
            response.getWriter().println("<a href='index.html'>Try Again</a>");
        }
    }
}