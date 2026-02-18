import matplotlib.pyplot as plt
import numpy as np
import time
from gtts import gTTS
import pygame
import os

# Function to generate a plot
def generate_plot(plot_id):
    x = np.linspace(0, 10, 100)
    y = np.sin(x + plot_id)  # Vary the plot based on the ID

    plt.figure()
    plt.plot(x, y)
    plt.title(f"Plot {plot_id}")
    filename = f"plot_{plot_id}.png"
    plt.savefig(filename)
    plt.close()
    return filename

# Function to play a voiceover
def play_voiceover(text, plot_id):
    voiceover_file = f"voiceover_{plot_id}.mp3"
    tts = gTTS(text=text, lang='en')
    tts.save(voiceover_file)

    # Initialize pygame mixer
    pygame.mixer.init()
    pygame.mixer.music.load(voiceover_file)
    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():
        time.sleep(1)

    os.remove(voiceover_file)  # Clean up the voiceover file

# Main logic
if __name__ == "__main__":
    for i in range(1, 4):  # Generate 3 plots as an example
        plot_file = generate_plot(i)
        print(f"Generated: {plot_file}")

        play_voiceover(f"This is the description for plot {i}.", i)
        print(f"Voiceover completed for Plot {i}.")
