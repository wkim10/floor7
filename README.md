# Floor7

Developed in JumboHack 2025.

## The Project

Floor7 is a virtual career fair platform which allows university students to engage with recruiters and other attendees in real time, through a video-game like platform.
Our goal is to transform how current virtual career fairs are held, making them more fun, interactive, and accessible for everyone involved.

Over the weekend, we managed to create an robust backend:

- Extensive real-time multiplayer simulation.
- Proximity-based, real-time video calling using WebRTC

Our frontend includes these following features:

- Initially created immersive 2D maps with Pixi.js, then pivoting to create our own maps from scratch
- Inbuilt collision detection, allowing for players to hop into one-on-one calls and triggering events like popups for different booths
- An interactive “Alice in Wonderland” introduction to simulate entering the career fair!
- A customizable user experience with avatar customization, a Club-Penguin-like social feature with chats
- An interactive UI, allowing for users to walk up to booths to view information

## The Team

### Yihui Hu

Yihui contributed to the backend, primarily websocket logic, along with Johnny. Together with Johnny, he designed and implemented simultaneous user interaction, collision detection, and proximity detection. Yihui also took point on debugging WebRTC logic to get the video chats up.

### Johnny Tan

Johnny contributed to the backend, primarily websocket logic, along with Yihui. Johnny worked with Clarence to design the lower-level schema designs, and later with Yihui, to design and implement simultaneous user interaction, collision detection, and proximity detection.

### Clarence Yeh

Clarence was an all-rounder, taking point on keeping the team on track, breaking the projects down into tasks and helping to pivot and adapt to project-level problems as they came up. He assisted with designing and implementing some the websocket architecture, as well as working on frontend designs of the 2D environment in Pixi with Won and Loc, and later on the integration of frontend environment to the Websocket server.

### Loc Mai

Loc contributed largely in the frontend space, working initially with Pixi.js to create immersive 2D environments. Later, when our we decided to pivot away from our Pixi.js integration, Loc took lead in helping to port the logic for Pixi.js into the main flow, and then implementing the fun “rabbit hole” feature that’s the landing page of the app.

### Won Kim

Won contributed in another important part of the frontend space -- building the UI components for users to use, such as the front-facing menus, popups, navbars, HUDs, and character customization to create a more personalized user experience.

### Fa Taepaisitphongse

Fa was the main UI and designer for the project, taking charge of the product design, user interviews, and managing the overall design of the project. She worked closely with Won and Loc, as well as the rest of the team to keep us clear on what features to implement, helping the team pivot as needed.

## Acknowledgements

We'd like to acknowledge that other than TypeScript and Next.js, which we have extensive experience developing full-stack apps in, we were learning entirely new technologies. Thus we could not have done it without the help from the following technologies:

- [Gather Clone](https://github.com/trevorwrightdev/gather-clone) a major source of inspiration that demonstrated the idea’s technical feasibility. It was a good frame of reference for how to set up some of the socket logic.
- Thank you OpenAI for ChatGPT+
- [Pixi](https://pixijs.com/) We don’t use any of this anymore, but it was something we did develop on and took inspiration from when developing our own 2D environment and collision detection
- [Socket.io](https://socket.io/) - this allowed us to have an immersive real-time multiplayer experience
- [WebRTC](https://webrtc.org/) - While it's still in extremely early stages, WebRTC formed the core of our live video streaming experience. By synergizing it with socket.io, we're able to create
- Next.js - we used its framework and routing, though we don’t have many pages
