document.addEventListener("DOMContentLoaded", function () {
    // Select all slideshow containers
    const slideshows = document.querySelectorAll(".slideshow-container");

    let activeAudio = null; // Tracks the currently playing audio
    let activeInterval = null; // Tracks the currently running interval for sliding
    let activeSlideshow = null; // Tracks the currently active slideshow

    slideshows.forEach((slideshow) => {
        const slides = slideshow.querySelectorAll(".slide");
        let currentSlide = 0;

        // Get audio associated with this slideshow
        const groupAudioSrc = slideshow.getAttribute("data-audio");
        let groupAudio = groupAudioSrc ? new Audio(groupAudioSrc) : null;

        // Function to show a specific slide
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? "block" : "none"; // Show only the current slide
            });
        }

        // Function to start the slideshow
        function startSlideshow() {
            if (activeSlideshow !== slideshow) {
                stopAllAudioAndIntervals(); // Stop other active slideshows and audios
            }

            activeSlideshow = slideshow;

            // Start image sliding
            activeInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length; // Loop through slides
                showSlide(currentSlide);
            }, 5000); // Change slide every 3 seconds

            // Play associated audio
            if (groupAudio) {
                groupAudio.currentTime = 0; // Reset audio to the start

                groupAudio
                    .play()
                    .then(() => {
                        console.log("Audio started successfully.");
                        activeAudio = groupAudio;

                        // Stop the slideshow and audio when the audio ends
                        groupAudio.onended = () => {
                            console.log("Audio ended, stopping slideshow.");
                            stopAllAudioAndIntervals();
                        };
                    })
                    .catch((error) => {
                        console.error(
                            "Failed to start audio playback. Ensure user interaction occurred:",
                            error
                        );
                    });
            }
        }

        // Function to stop all active audio and intervals
        function stopAllAudioAndIntervals() {
            if (activeAudio) {
                activeAudio.pause();
                activeAudio.currentTime = 0; // Reset playback
                console.log("Audio stopped.");
                activeAudio = null;
            }
            if (activeInterval) {
                clearInterval(activeInterval);
                console.log("Slideshow interval cleared.");
                activeInterval = null;
            }
            activeSlideshow = null;
        }

        // Initially show the first slide
        showSlide(currentSlide);

        // Add click listener to the slideshow container
        slideshow.addEventListener("click", () => {
            if (activeSlideshow === slideshow) {
                // If the clicked slideshow is already active, stop it
                console.log("Stopping active slideshow.");
                stopAllAudioAndIntervals();
            } else {
                // Start the clicked slideshow
                console.log("Starting slideshow for:", slideshow);
                startSlideshow();
            }
        });
    });
});
