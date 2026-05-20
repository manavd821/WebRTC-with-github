import { useEffect, useRef } from "react";

import {
    LocalParticipant,
    LocalTrackPublication,
    Participant,
    RemoteParticipant,
    RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";

const identity = "Manav" + Math.trunc(Math.random() * 1000);

export default function App() {

    const roomRef = useRef<Room>(null);
    const remoteMediaRef = useRef<HTMLDivElement>(null);
    const localMediaRef = useRef<HTMLDivElement>(null);

    const handleTrackSubscribed = (
        track: RemoteTrack,
        publication: RemoteTrackPublication,
        participant: RemoteParticipant,
    ) => {
        console.log("Recieved track from :",participant.name);
        console.log("Track from:", participant.identity, "| Local:", roomRef.current?.localParticipant.identity);
        console.log("Track kind:", track.kind);

        if(participant.identity === identity) return;

        if(track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio){
            const ele = track.attach();
            if(remoteMediaRef.current)
                remoteMediaRef.current.innerHTML = "";
            remoteMediaRef.current?.appendChild(ele);
        }
    };
    const handleTrackUnsubscribed = (
        track: RemoteTrack,
        publication: RemoteTrackPublication,
        participant: RemoteParticipant,
    ) => {
        // remove tracks from all attached elements
        track.detach();
    };

    const handleActiveSpeakerChange = (speakers: Participant[]) => {};

    const handleDisconnect = () => {console.log('disconnected from room');};

    const handleLocalTrackUnpublished = (
        publication: LocalTrackPublication,
        participant: LocalParticipant,

    ) => {
        publication.track?.detach();
    }
    useEffect(() => {

        const init = async () => {
            const room = new Room({
                adaptiveStream : true,
                dynacast: true
    
            });
            roomRef.current = room;
            const token_url = `https://webrtc-with-livekit.onrender.com/token?identity=${identity}`
    
            const res = await fetch(token_url);
            const {token , url} = await res.json();
    
            room.prepareConnection(url, token);

            room
            .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
            .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
            .on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange)
            .on(RoomEvent.Disconnected, handleDisconnect)
            .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);

            await room.connect(url, token);
            console.log('connected to room', room.name);

            await room.localParticipant.enableCameraAndMicrophone();

            room.localParticipant
            .videoTrackPublications
            .forEach(publication => {
                const ele = publication.track?.attach();
                if(localMediaRef.current)
                    localMediaRef.current.innerHTML = "";
                if(ele) localMediaRef.current?.appendChild(ele);
            })

            const remoteParticipants = room.remoteParticipants; // Map<string, RemoteParticipant>

            console.log("Count:", room.remoteParticipants.size);
            room.remoteParticipants.forEach(participant => {
            console.log("Participant:", participant.identity, participant.name);
});

        };



        init();
    }, [])

    return (
        <>
            <div className="p-10">

                <h1 className="text-3xl mb-10">
                    LiveKit Demo
                </h1>

                <div className="grid grid-cols-2 gap-10">

                    <div>
                    <h2 className="mb-4">
                        Local Video
                    </h2>

                    <div
                        ref={localMediaRef}
                        className="bg-black h-80"
                    />
                    </div>

                    <div>
                    <h2 className="mb-4">
                        Remote Video
                    </h2>

                    <div
                        ref={remoteMediaRef}
                        className="bg-black h-80"
                    />
                    </div>

                </div>

                </div>
        </>
    )
}