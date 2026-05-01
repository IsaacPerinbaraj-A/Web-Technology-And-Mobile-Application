package com.example.emailsenderapp;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Patterns;
import android.view.View;
import android.widget.*;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    EditText email, subject, message;
    Button sendBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        email = findViewById(R.id.email);
        subject = findViewById(R.id.subject);
        message = findViewById(R.id.message);
        sendBtn = findViewById(R.id.sendBtn);

        sendBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String emailText = email.getText().toString();
                String subjectText = subject.getText().toString();
                String messageText = message.getText().toString();

                // Validation
                if (emailText.isEmpty() || subjectText.isEmpty() || messageText.isEmpty()) {
                    Toast.makeText(MainActivity.this, "All fields are required", Toast.LENGTH_SHORT).show();
                    return;
                }

                if (!Patterns.EMAIL_ADDRESS.matcher(emailText).matches()) {
                    Toast.makeText(MainActivity.this, "Invalid Email Address", Toast.LENGTH_SHORT).show();
                    return;
                }

                // Intent to send email
                Intent intent = new Intent(Intent.ACTION_SENDTO);
                intent.setData(Uri.parse("mailto:" + emailText));
                intent.putExtra(Intent.EXTRA_SUBJECT, subjectText);
                intent.putExtra(Intent.EXTRA_TEXT, messageText);

                try {
                    startActivity(Intent.createChooser(intent, "Send Email"));
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "No email app found", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}