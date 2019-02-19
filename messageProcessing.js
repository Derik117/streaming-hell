const zeroWidthSpace = "​";
const readableNames = {
    yandex: 'Yandex',
    spotify: 'Spotify',
    appleMusic: 'Apple Music',
    youtubeMusic: 'YouTube Music',
    youtube: 'YouTube',
    pandora: 'Pandora',
    google: 'Google',
    deezer: 'Deezer',
    tidal: 'Tidal',
    napster: 'Napster',
    fanburst: 'Fanburst',
};
const markdownReplacements = [
    [/\*/g, '\\*'],
    [/`/g, '\\`'],
    [/\//g, '\\/'],
    [/_/g, '\\_']];

const escapeMarkdown = ({text}) => {
    return markdownReplacements.reduce(function (text, replacement) {
            return text.replace(replacement[0], replacement[1])
        },
        text)
};

const getMessageText = ({data}) => {
    let artistName = data.songlink.artistName.split(', ')[0];
    let songName = data.songlink.title;
    let songTitleTag = `*${escapeMarkdown({text: artistName})} – ${escapeMarkdown({text: songName})}*`;
    let coverUrl = data.songlink.thumbnailUrl;
    let coverTag = coverUrl ? `[${zeroWidthSpace}](${coverUrl})` : '';
    let links = '';
    data.songlink.links.listen.sort((a, b) => {
        const nameA = readableNames[a.name] || a.name;
        const nameB = readableNames[b.name] || b.name;
        if (nameA > nameB) {
            return 1;
        } else if (nameA < nameB) {
            return -1;
        }
        return 0;
    });
    data.songlink.links.listen.forEach(item => {
        const name = readableNames[item.name] || item.name;
        links = `${links}\n[${escapeMarkdown({text: name})}](${item.data.listenUrl})\n`;
    });
    return `${songTitleTag}\n\n${coverTag}${links.trim()}`;
};

module.exports = getMessageText;
