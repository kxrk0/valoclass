const fs = require('fs');
const cheerio = require('cheerio');

// The HTML data provided by the user for all agents
const agentHtmlData = `
Astra:
<a href="/?id=astra-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="astra-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/astra-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Gravity Well" src="https://lineupsvalorant.com/static/abilities/Gravity Well.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Astra" src="https://lineupsvalorant.com/static/agents/Astra.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Clear</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Short">A Short</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'astra-1', 'lineup')" data-id="astra-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=astra-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="astra-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/astra-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Gravity Well" src="https://lineupsvalorant.com/static/abilities/Gravity Well.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Astra" src="https://lineupsvalorant.com/static/agents/Astra.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Elbow Clear Lineup</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Long">B Long</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Elbow">B Elbow</a></span>
        <div onclick="moreOptionsMenu(event, 'astra-2', 'lineup')" data-id="astra-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Breach:
<a href="/?id=breach-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="breach-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/breach-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Fault Line" src="https://lineupsvalorant.com/static/abilities/Fault Line.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Breach" src="https://lineupsvalorant.com/static/agents/Breach.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Clear Lineup</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;start=A Main">A Main</a> to <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'breach-1', 'lineup')" data-id="breach-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=breach-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="breach-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/breach-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Aftershock" src="https://lineupsvalorant.com/static/abilities/Aftershock.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Breach" src="https://lineupsvalorant.com/static/agents/Breach.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Default Clear Lineup</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;start=A Main">A Main</a> to <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;end=A Site Default">A Site Default</a></span>
        <div onclick="moreOptionsMenu(event, 'breach-2', 'lineup')" data-id="breach-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Brimstone:
<a href="/?id=brim-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="brim-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/brim-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Incendiary" src="https://lineupsvalorant.com/static/abilities/Incendiary.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Brimstone" src="https://lineupsvalorant.com/static/agents/Brimstone.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Truck Denial from Short</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Short">A Short</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=A Truck">A Truck</a></span>
        <div onclick="moreOptionsMenu(event, 'brim-1', 'lineup')" data-id="brim-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=brim-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="brim-2" data-type="post-plant">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/brim-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Incendiary" src="https://lineupsvalorant.com/static/abilities/Incendiary.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Brimstone" src="https://lineupsvalorant.com/static/agents/Brimstone.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Stall Defuse B Site Default</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Long">B Long</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Site">B Site</a></span>
        <div onclick="moreOptionsMenu(event, 'brim-2', 'post-plant')" data-id="brim-2" data-type="post-plant" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=brim-3" class="lineup-box" rel="nofollow" tabindex="0" data-id="brim-3" data-type="post-plant">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/brim-3/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Incendiary" src="https://lineupsvalorant.com/static/abilities/Incendiary.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Brimstone" src="https://lineupsvalorant.com/static/agents/Brimstone.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Post Plant Generator Molly</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;start=A Main">A Main</a> to <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;end=A Generator">A Generator</a></span>
        <div onclick="moreOptionsMenu(event, 'brim-3', 'post-plant')" data-id="brim-3" data-type="post-plant" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Chamber:
<a href="/?id=chamber-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="chamber-1" data-type="setup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/chamber-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Trademark" src="https://lineupsvalorant.com/static/abilities/Trademark.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Chamber" src="https://lineupsvalorant.com/static/agents/Chamber.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Aggressive B Site Hold</span>
        <br>
        <span class="lineup-box-position">For <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Elbow">B Elbow</a></span>
        <div onclick="moreOptionsMenu(event, 'chamber-1', 'setup')" data-id="chamber-1" data-type="setup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=chamber-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="chamber-2" data-type="setup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/chamber-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Rendezvous" src="https://lineupsvalorant.com/static/abilities/Rendezvous.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Chamber" src="https://lineupsvalorant.com/static/agents/Chamber.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Anchor Setup</span>
        <br>
        <span class="lineup-box-position">For <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;start=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'chamber-2', 'setup')" data-id="chamber-2" data-type="setup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Cypher:
<a href="/?id=cypher-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="cypher-1" data-type="setup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/cypher-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Spycam" src="https://lineupsvalorant.com/static/abilities/Spycam.webp" loading="lazy">
            <img alt="VALORANT Trapwire" src="https://lineupsvalorant.com/static/abilities/Trapwire.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Cypher" src="https://lineupsvalorant.com/static/agents/Cypher.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Site Defense Setup</span>
        <br>
        <span class="lineup-box-position">For <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Site">B Site</a></span>
        <div onclick="moreOptionsMenu(event, 'cypher-1', 'setup')" data-id="cypher-1" data-type="setup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=cypher-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="cypher-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/cypher-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Cyber Cage" src="https://lineupsvalorant.com/static/abilities/Cyber Cage.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Cypher" src="https://lineupsvalorant.com/static/agents/Cypher.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Long Smoke for Push</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=Attacker Spawn">Attacker Spawn</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Long">B Long</a></span>
        <div onclick="moreOptionsMenu(event, 'cypher-2', 'lineup')" data-id="cypher-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Deadlock:
<a href="/?id=deadlock-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="deadlock-1" data-type="setup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/deadlock-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Barrier Mesh" src="https://lineupsvalorant.com/static/abilities/Barrier Mesh.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Deadlock" src="https://lineupsvalorant.com/static/agents/Deadlock.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Wall Block</span>
        <br>
        <span class="lineup-box-position">For <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;start=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'deadlock-1', 'setup')" data-id="deadlock-1" data-type="setup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=deadlock-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="deadlock-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/deadlock-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Sonic Sensor" src="https://lineupsvalorant.com/static/abilities/Sonic Sensor.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Deadlock" src="https://lineupsvalorant.com/static/agents/Deadlock.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Long Sound Trap</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=Defender Spawn">Defender Spawn</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Long">B Long</a></span>
        <div onclick="moreOptionsMenu(event, 'deadlock-2', 'lineup')" data-id="deadlock-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Fade:
<a href="/?id=fade-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="fade-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/fade-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Prowler" src="https://lineupsvalorant.com/static/abilities/Prowler.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Fade" src="https://lineupsvalorant.com/static/agents/Fade.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Prowler Clear</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;start=A Main">A Main</a> to <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'fade-1', 'lineup')" data-id="fade-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=fade-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="fade-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/fade-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Haunts" src="https://lineupsvalorant.com/static/abilities/Haunts.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Fade" src="https://lineupsvalorant.com/static/agents/Fade.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Site Info Gather</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;start=B Main">B Main</a> to <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;end=B Site">B Site</a></span>
        <div onclick="moreOptionsMenu(event, 'fade-2', 'lineup')" data-id="fade-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Gekko:
<a href="/?id=gekko-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="gekko-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/gekko-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Dizzy" src="https://lineupsvalorant.com/static/abilities/Dizzy.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Gekko" src="https://lineupsvalorant.com/static/agents/Gekko.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Flash Setup</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Short">A Short</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'gekko-1', 'lineup')" data-id="gekko-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=gekko-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="gekko-2" data-type="post-plant">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/gekko-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Thrash" src="https://lineupsvalorant.com/static/abilities/Thrash.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Gekko" src="https://lineupsvalorant.com/static/agents/Gekko.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Post Plant B Site Stall</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Halls">B Halls</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Site">B Site</a></span>
        <div onclick="moreOptionsMenu(event, 'gekko-2', 'post-plant')" data-id="gekko-2" data-type="post-plant" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Harbor:
<a href="/?id=harbor-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="harbor-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/harbor-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT High Tide" src="https://lineupsvalorant.com/static/abilities/High Tide.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Harbor" src="https://lineupsvalorant.com/static/agents/Harbor.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Wall Push</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Short">A Short</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'harbor-1', 'lineup')" data-id="harbor-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=harbor-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="harbor-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/harbor-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Cove" src="https://lineupsvalorant.com/static/abilities/Cove.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Harbor" src="https://lineupsvalorant.com/static/agents/Harbor.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Site Smoke Cover</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Long">B Long</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Site">B Site</a></span>
        <div onclick="moreOptionsMenu(event, 'harbor-2', 'lineup')" data-id="harbor-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

KAYO:
<a href="/?id=kayo-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="kayo-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/kayo-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT ZERO/point" src="https://lineupsvalorant.com/static/abilities/ZERO:point.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="KAYO" src="https://lineupsvalorant.com/static/agents/KAYO.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Suppress Lineup</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;start=A Main">A Main</a> to <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'kayo-1', 'lineup')" data-id="kayo-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=kayo-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="kayo-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/kayo-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT FLASH/drive" src="https://lineupsvalorant.com/static/abilities/FLASH:drive.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="KAYO" src="https://lineupsvalorant.com/static/agents/KAYO.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Site Flash Entry</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;start=B Main">B Main</a> to <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;end=B Site">B Site</a></span>
        <div onclick="moreOptionsMenu(event, 'kayo-2', 'lineup')" data-id="kayo-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Killjoy:
<a href="/?id=killjoy-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="killjoy-1" data-type="setup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/killjoy-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Alarmbot" src="https://lineupsvalorant.com/static/abilities/Alarmbot.webp" loading="lazy">
            <img alt="VALORANT Turret" src="https://lineupsvalorant.com/static/abilities/Turret.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Killjoy" src="https://lineupsvalorant.com/static/agents/Killjoy.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Defense Setup</span>
        <br>
        <span class="lineup-box-position">For <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'killjoy-1', 'setup')" data-id="killjoy-1" data-type="setup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=killjoy-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="killjoy-2" data-type="post-plant">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/killjoy-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Nanoswarm" src="https://lineupsvalorant.com/static/abilities/Nanoswarm.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Killjoy" src="https://lineupsvalorant.com/static/agents/Killjoy.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Post Plant B Site Deny</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Halls">B Halls</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Site">B Site</a></span>
        <div onclick="moreOptionsMenu(event, 'killjoy-2', 'post-plant')" data-id="killjoy-2" data-type="post-plant" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Neon:
<a href="/?id=neon-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="neon-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/neon-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Fast Lane" src="https://lineupsvalorant.com/static/abilities/Fast Lane.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Neon" src="https://lineupsvalorant.com/static/agents/Neon.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Wall Push</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Short">A Short</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'neon-1', 'lineup')" data-id="neon-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=neon-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="neon-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/neon-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Relay Bolt" src="https://lineupsvalorant.com/static/abilities/Relay Bolt.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Neon" src="https://lineupsvalorant.com/static/agents/Neon.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Long Clear Stun</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Long">B Long</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Elbow">B Elbow</a></span>
        <div onclick="moreOptionsMenu(event, 'neon-2', 'lineup')" data-id="neon-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Omen:
<a href="/?id=omen-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="omen-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/omen-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Dark Cover" src="https://lineupsvalorant.com/static/abilities/Dark Cover.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Omen" src="https://lineupsvalorant.com/static/agents/Omen.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">One Way A Short</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=Attacker Spawn">Attacker Spawn</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=A Short">A Short</a></span>
        <div onclick="moreOptionsMenu(event, 'omen-1', 'lineup')" data-id="omen-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=omen-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="omen-2" data-type="post-plant">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/omen-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Dark Cover" src="https://lineupsvalorant.com/static/abilities/Dark Cover.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Omen" src="https://lineupsvalorant.com/static/agents/Omen.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Post Plant B Site Smoke</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Halls">B Halls</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Site">B Site</a></span>
        <div onclick="moreOptionsMenu(event, 'omen-2', 'post-plant')" data-id="omen-2" data-type="post-plant" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Phoenix:
<a href="/?id=phoenix-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="phoenix-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/phoenix-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Hot Hands" src="https://lineupsvalorant.com/static/abilities/Hot Hands.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Phoenix" src="https://lineupsvalorant.com/static/agents/Phoenix.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Clear Molly</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Short">A Short</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'phoenix-1', 'lineup')" data-id="phoenix-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=phoenix-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="phoenix-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/phoenix-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Blaze" src="https://lineupsvalorant.com/static/abilities/Blaze.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Phoenix" src="https://lineupsvalorant.com/static/agents/Phoenix.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Long Wall Push</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Long">B Long</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Elbow">B Elbow</a></span>
        <div onclick="moreOptionsMenu(event, 'phoenix-2', 'lineup')" data-id="phoenix-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Raze:
<a href="/?id=raze-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="raze-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/raze-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Paint Shells" src="https://lineupsvalorant.com/static/abilities/Paint Shells.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Raze" src="https://lineupsvalorant.com/static/agents/Raze.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Clear Nade</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Short">A Short</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'raze-1', 'lineup')" data-id="raze-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=raze-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="raze-2" data-type="post-plant">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/raze-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Paint Shells" src="https://lineupsvalorant.com/static/abilities/Paint Shells.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Raze" src="https://lineupsvalorant.com/static/agents/Raze.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Post Plant B Site Nade</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Halls">B Halls</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Site">B Site</a></span>
        <div onclick="moreOptionsMenu(event, 'raze-2', 'post-plant')" data-id="raze-2" data-type="post-plant" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Sage:
<a href="/?id=sage-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="sage-1" data-type="setup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/sage-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Barrier Orb" src="https://lineupsvalorant.com/static/abilities/Barrier Orb.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Sage" src="https://lineupsvalorant.com/static/agents/Sage.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Wall Setup</span>
        <br>
        <span class="lineup-box-position">For <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'sage-1', 'setup')" data-id="sage-1" data-type="setup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=sage-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="sage-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/sage-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Slow Orb" src="https://lineupsvalorant.com/static/abilities/Slow Orb.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Sage" src="https://lineupsvalorant.com/static/agents/Sage.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Long Slow Push</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Long">B Long</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Elbow">B Elbow</a></span>
        <div onclick="moreOptionsMenu(event, 'sage-2', 'lineup')" data-id="sage-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Skye:
<a href="/?id=skye-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="skye-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/skye-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Guiding Light" src="https://lineupsvalorant.com/static/abilities/Guiding Light.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Skye" src="https://lineupsvalorant.com/static/agents/Skye.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Flash Entry</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Short">A Short</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'skye-1', 'lineup')" data-id="skye-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=skye-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="skye-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/skye-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Trailblazer" src="https://lineupsvalorant.com/static/abilities/Trailblazer.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Skye" src="https://lineupsvalorant.com/static/agents/Skye.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Site Dog Clear</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Long">B Long</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Site">B Site</a></span>
        <div onclick="moreOptionsMenu(event, 'skye-2', 'lineup')" data-id="skye-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Sova:
<a href="/?id=sova-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="sova-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/sova-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Recon Bolt" src="https://lineupsvalorant.com/static/abilities/Recon Bolt.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Sova" src="https://lineupsvalorant.com/static/agents/Sova.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Reveal all of A Site</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;start=A Lobby">A Lobby</a> to <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'sova-1', 'lineup')" data-id="sova-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=sova-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="sova-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/sova-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Recon Bolt" src="https://lineupsvalorant.com/static/abilities/Recon Bolt.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Sova" src="https://lineupsvalorant.com/static/agents/Sova.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Sova Lineup to A From A Lobby</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;start=A Lobby">A Lobby</a> to <a onclick="event.stopPropagation();" href="/?map=Ascent&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'sova-2', 'lineup')" data-id="sova-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=sova-3" class="lineup-box" rel="nofollow" tabindex="0" data-id="sova-3" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/sova-3/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Recon Bolt" src="https://lineupsvalorant.com/static/abilities/Recon Bolt.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Sova" src="https://lineupsvalorant.com/static/agents/Sova.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Attack A Site</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Split&amp;start=A Long">A Long</a> to <a onclick="event.stopPropagation();" href="/?map=Split&amp;end=A Hell">A Hell</a></span>
        <div onclick="moreOptionsMenu(event, 'sova-3', 'lineup')" data-id="sova-3" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Tejo:
<a href="/?id=tejo-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="tejo-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/tejo-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Steady Aim" src="https://lineupsvalorant.com/static/abilities/Steady Aim.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Tejo" src="https://lineupsvalorant.com/static/agents/Tejo.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Wall Bang</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Short">A Short</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'tejo-1', 'lineup')" data-id="tejo-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=tejo-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="tejo-2" data-type="setup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/tejo-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Dimensional Drift" src="https://lineupsvalorant.com/static/abilities/Dimensional Drift.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Tejo" src="https://lineupsvalorant.com/static/agents/Tejo.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Dimensional Drift Rotate</span>
        <br>
        <span class="lineup-box-position">For <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=Mid">Mid</a></span>
        <div onclick="moreOptionsMenu(event, 'tejo-2', 'setup')" data-id="tejo-2" data-type="setup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Viper:
<a href="/?id=viper-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="viper-1" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/viper-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Snake Bite" src="https://lineupsvalorant.com/static/abilities/Snake Bite.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Viper" src="https://lineupsvalorant.com/static/agents/Viper.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Default Molly from Spawn</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=Attacker Spawn">Attacker Spawn</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=A Site Default">A Site Default</a></span>
        <div onclick="moreOptionsMenu(event, 'viper-1', 'lineup')" data-id="viper-1" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=viper-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="viper-2" data-type="post-plant">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/viper-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Snake Bite" src="https://lineupsvalorant.com/static/abilities/Snake Bite.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Viper" src="https://lineupsvalorant.com/static/agents/Viper.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Post Plant A Default Molly</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Short">A Short</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=A Site Default">A Site Default</a></span>
        <div onclick="moreOptionsMenu(event, 'viper-2', 'post-plant')" data-id="viper-2" data-type="post-plant" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=viper-3" class="lineup-box" rel="nofollow" tabindex="0" data-id="viper-3" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/viper-3/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Toxic Screen" src="https://lineupsvalorant.com/static/abilities/Toxic Screen.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Viper" src="https://lineupsvalorant.com/static/agents/Viper.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Long Wall for Push</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=Attacker Spawn">Attacker Spawn</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Long">B Long</a></span>
        <div onclick="moreOptionsMenu(event, 'viper-3', 'lineup')" data-id="viper-3" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=viper-4" class="lineup-box" rel="nofollow" tabindex="0" data-id="viper-4" data-type="post-plant">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/viper-4/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Snake Bite" src="https://lineupsvalorant.com/static/abilities/Snake Bite.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Viper" src="https://lineupsvalorant.com/static/agents/Viper.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">Post Plant B Site Molly</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Halls">B Halls</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Site">B Site</a></span>
        <div onclick="moreOptionsMenu(event, 'viper-4', 'post-plant')" data-id="viper-4" data-type="post-plant" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Vyse:
<a href="/?id=vyse-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="vyse-1" data-type="setup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/vyse-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Shear" src="https://lineupsvalorant.com/static/abilities/Shear.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Vyse" src="https://lineupsvalorant.com/static/agents/Vyse.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Shear Setup</span>
        <br>
        <span class="lineup-box-position">For <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'vyse-1', 'setup')" data-id="vyse-1" data-type="setup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=vyse-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="vyse-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/vyse-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Arc Rose" src="https://lineupsvalorant.com/static/abilities/Arc Rose.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Vyse" src="https://lineupsvalorant.com/static/agents/Vyse.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Long Arc Rose Blind</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Long">B Long</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Elbow">B Elbow</a></span>
        <div onclick="moreOptionsMenu(event, 'vyse-2', 'lineup')" data-id="vyse-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Yoru:
<a href="/?id=yoru-1" class="lineup-box" rel="nofollow" tabindex="0" data-id="yoru-1" data-type="setup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/yoru-1/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Gatecrash" src="https://lineupsvalorant.com/static/abilities/Gatecrash.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Yoru" src="https://lineupsvalorant.com/static/agents/Yoru.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">A Site Teleport Setup</span>
        <br>
        <span class="lineup-box-position">For <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=A Site">A Site</a></span>
        <div onclick="moreOptionsMenu(event, 'yoru-1', 'setup')" data-id="yoru-1" data-type="setup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

<a href="/?id=yoru-2" class="lineup-box" rel="nofollow" tabindex="0" data-id="yoru-2" data-type="lineup">
    <div class="lineups-box-image-div">
        <img loading="lazy" alt="lineup image" class="lineup-box-image" src="https://lineupsvalorant.com/static/lineup_images_thumbnail/yoru-2/3.webp">
        <div class="lineup-box-darken"></div>
        <div class="lineup-box-abilities">
            <img alt="VALORANT Blindside" src="https://lineupsvalorant.com/static/abilities/Blindside.webp" loading="lazy">
        </div>
        <img loading="lazy" class="lineup-box-agent" alt="Yoru" src="https://lineupsvalorant.com/static/agents/Yoru.webp">
    </div>
    <div class="lineup-box-text">
        <span class="lineup-box-title">B Site Flash Entry</span>
        <br>
        <span class="lineup-box-position">From <a onclick="event.stopPropagation();" href="/?map=Bind&amp;start=B Long">B Long</a> to <a onclick="event.stopPropagation();" href="/?map=Bind&amp;end=B Site">B Site</a></span>
        <div onclick="moreOptionsMenu(event, 'yoru-2', 'lineup')" data-id="yoru-2" data-type="lineup" class="lineup_box_options_parent">
            <img src="https://lineupsvalorant.com/static/ui_icons/more_dots.png" alt="more options">
        </div>
    </div>
</a>

Eksik her şeyi tamamlamana yardımcı olacak kodlar yukarıda
`;

function parseLineupHTML(html) {
  const lineups = [];
  const $ = cheerio.load(html);
  
  // Find all lineup boxes
  $('a.lineup-box').each((index, element) => {
    const $element = $(element);
    
    // Extract basic info
    const id = $element.attr('data-id');
    const type = $element.attr('data-type');
    const href = $element.attr('href');
    
    // Extract image
    const image = $element.find('.lineup-box-image').attr('src');
    
    // Extract agent
    const agentImg = $element.find('.lineup-box-agent');
    const agent = agentImg.attr('alt');
    
    // Extract abilities
    const abilities = [];
    $element.find('.lineup-box-abilities img').each((i, abilityEl) => {
      const abilityAlt = $(abilityEl).attr('alt');
      if (abilityAlt && abilityAlt.includes('VALORANT ')) {
        abilities.push(abilityAlt.replace('VALORANT ', ''));
      }
    });
    
    // Extract title
    const title = $element.find('.lineup-box-title').text().trim();
    
    // Extract position info
    const positionText = $element.find('.lineup-box-position').text().trim();
    
    // Extract from/to locations
    let from = '';
    let to = '';
    let map = '';
    
    // Parse position links to get from/to and map
    const fromLink = $element.find('.lineup-box-position a').first();
    const toLink = $element.find('.lineup-box-position a').last();
    
    if (fromLink.length > 0) {
      const fromHref = fromLink.attr('href');
      const fromMatch = fromHref.match(/[?&](?:start|map)=([^&]+)/g);
      
      if (fromMatch) {
        fromMatch.forEach(match => {
          if (match.includes('start=')) {
            from = decodeURIComponent(match.split('start=')[1]);
          } else if (match.includes('map=')) {
            map = decodeURIComponent(match.split('map=')[1]);
          }
        });
      }
      
      // Get from text if no URL params
      if (!from) {
        from = fromLink.text().trim();
      }
    }
    
    if (toLink.length > 0 && toLink.attr('href') !== fromLink.attr('href')) {
      const toHref = toLink.attr('href');
      const toMatch = toHref.match(/[?&]end=([^&]+)/);
      
      if (toMatch) {
        to = decodeURIComponent(toMatch[1]);
      } else {
        to = toLink.text().trim();
      }
    }
    
    // For setup type, extract the location differently
    if (type === 'setup') {
      const setupMatch = positionText.match(/For (.+)/);
      if (setupMatch) {
        from = setupMatch[1];
        to = ''; // Setup doesn't have a "to" location
      }
    }
    
    // Determine tags based on type and other factors
    const tags = [];
    if (type === 'post-plant') {
      tags.push('post-plant');
    }
    if (title.toLowerCase().includes('clear')) {
      tags.push('clear');
    }
    if (title.toLowerCase().includes('deny') || title.toLowerCase().includes('denial')) {
      tags.push('denial');
    }
    if (title.toLowerCase().includes('entry')) {
      tags.push('entry');
    }
    if (title.toLowerCase().includes('info') || title.toLowerCase().includes('reveal')) {
      tags.push('info');
    }
    
    // Create lineup object
    const lineup = {
      id,
      type,
      agent,
      abilities,
      title,
      description: type === 'setup' ? `For ${from}` : `From ${from} to ${to}`,
      from,
      to,
      image,
      map,
      tags
    };
    
    lineups.push(lineup);
  });
  
  return lineups;
}

// Parse the HTML data
const parsedLineups = parseLineupHTML(agentHtmlData);

// Output the results
console.log('=== PARSED LINEUPS ===');
console.log(JSON.stringify(parsedLineups, null, 2));

// Also create a summary
const summary = {
  totalLineups: parsedLineups.length,
  byAgent: {},
  byType: {},
  byMap: {}
};

parsedLineups.forEach(lineup => {
  // Count by agent
  summary.byAgent[lineup.agent] = (summary.byAgent[lineup.agent] || 0) + 1;
  
  // Count by type
  summary.byType[lineup.type] = (summary.byType[lineup.type] || 0) + 1;
  
  // Count by map
  if (lineup.map) {
    summary.byMap[lineup.map] = (summary.byMap[lineup.map] || 0) + 1;
  }
});

console.log('\n=== SUMMARY ===');
console.log(JSON.stringify(summary, null, 2));

// Save to file
fs.writeFileSync('parsed-lineups.json', JSON.stringify(parsedLineups, null, 2));
console.log('\n✅ Parsed lineups saved to parsed-lineups.json');
