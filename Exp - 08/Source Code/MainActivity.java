package com.example.font_change;

import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.res.ResourcesCompat;

public class MainActivity extends AppCompatActivity {

    TextView sampleText;
    Button changeStyleButton;
    boolean isChanged = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        sampleText = findViewById(R.id.sampleText);
        changeStyleButton = findViewById(R.id.changeStyleButton);

        changeStyleButton.setOnClickListener(v -> {

            if (!isChanged) {
                // Change text color
                sampleText.setTextColor(Color.parseColor("#FF5722"));

                // Load custom font
                Typeface typeface = ResourcesCompat.getFont(MainActivity.this, R.font.roboto_regular);

                // Apply font with style
                if (typeface != null) {
                    sampleText.setTypeface(typeface, Typeface.BOLD_ITALIC);
                }

                Toast.makeText(MainActivity.this,
                        "Style Changed!",
                        Toast.LENGTH_SHORT).show();

            } else {
                // Reset to default
                sampleText.setTextColor(Color.BLACK);
                sampleText.setTypeface(Typeface.DEFAULT);

                Toast.makeText(MainActivity.this,
                        "Style Reset!",
                        Toast.LENGTH_SHORT).show();
            }

            isChanged = !isChanged;
        });
    }
}