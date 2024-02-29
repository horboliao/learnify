"use client";

export const YoutubeVideo = (props: {embedId: string}) => {
    return (
        <iframe
            src={`https://www.youtube.com/embed/${props.embedId}`}
            width={'100%'}
            height={'360'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
        />
    );
};
