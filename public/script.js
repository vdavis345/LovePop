const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('nextButton');
const balloonOverlay = document.getElementById('balloonOverlay');
const popSound = document.getElementById('popSound');
let localStream;
let remoteStream;
let peerConnection;

// STUN Server configuration (needed for WebRTC peer-to-peer connection)
const servers = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

// Constraints for media (video and audio)
const mediaConstraints = {
    video: true,
    audio: true
};

// Start the video chat when the button is clicked
startButton.addEventListener('click', startVideoChat);

// Show balloon pop animation and play sound when "Next" button is clicked
nextButton.addEventListener('click', () => {
    balloonOverlay.classList.add('show');
    popSound.play();
    setTimeout(() => {
        balloonOverlay.classList.remove('show');
    }, 500); // Hide after 500ms (duration of the pop animation)
});
// Existing code (keep all your current JavaScript code)

// ... (your existing code here)

// Add this new code for toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.location-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Here you can add logic to handle the selection
            console.log('Selected location:', this.dataset.value);
            
            // You might want to call a function here to update the matching preference
            // For example:
            // updateMatchingPreference(this.dataset.value);
        });
    });
});

// You can define additional functions here if needed
// function updateMatchingPreference(preference) {
//     // Logic to update the matching preference
// }

// ... (rest of your existing code)
async function startVideoChat() {
    // Get media stream from the user's webcam and microphone
    localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    localVideo.srcObject = localStream;

    // Create a peer connection
    peerConnection = new RTCPeerConnection(servers);

    // Add the local stream to the peer connection
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // Set up event listener to display the remote stream when received
    peerConnection.ontrack = event => {
        if (!remoteStream) {
            remoteStream = new MediaStream();
            remoteVideo.srcObject = remoteStream;
        }
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });
    };

    // Set up ICE candidate exchange (these candidates help establish a connection)
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            // Normally, you'd send the candidate to the remote peer via a signaling server
            console.log("New ICE candidate:", event.candidate);
        }
    };

    // Create an offer to connect with the remote peer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("Created offer:", offer);

    // Normally you'd send this offer to the remote peer via signaling (e.g., WebSockets)
    // Simulate an answer from the remote peer (this would normally come from the remote peer via signaling)
    peerConnection.setRemoteDescription(offer); // Simulating the remote peer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    console.log("Created answer:", answer);
}