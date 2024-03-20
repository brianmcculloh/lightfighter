<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<?php date_default_timezone_set('America/New_York'); ?>
<html xmlns="http://www.w3.org/1999/xhtml">

<head profile="http://gmpg.org/xfn/11">

<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<title>LIGHTFIGHTER | Spewnicorn Games</title>

<!-- begin style -->

<link rel="stylesheet" href="style.css" type="text/css" media="screen" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<script src="https://unpkg.com/@popperjs/core@2"></script>
<script src="https://unpkg.com/tippy.js@6"></script>
<script type="text/javascript" src="vendor/howler.core.min.js"></script>
<script type="module" src="script.js"></script>


</head>

<body>

  <div id="game-loading">
    
    <div class="game-loading-bar">

      <div class="game-loading-progress"><div class="glow"></div></div>

    </div>

  </div>

  <div id="game">

    <div id="end-game" class="modal">

      <h1>Game Over</h1>

    </div>

    <div id="selection-modal" class="modal scrollbar">

      <h1>Select Card(s)</h1>

      <div class="items"></div>

      <div class="button done">DONE</div>

    </div>

    <div id="overworld" class="modal scrollbar shown">

      <h1></h1>

      <div id="start-combat" class="button">ATTACK</div>

    </div>

    <div id="deck-modal" class="modal scrollbar">

      <h1>Your Deck</h1>

      <div class="items"></div>

      <div class="button done">DONE</div>

    </div>

    <div id="shop">

      <h1>Hangar</h1>

      <div class="boosters"></div>

      <div class="packs"></div>

      <div class="button done">DONE</div>

    </div>

    <div id="enemy">

      <div class="info">

        <div class="name"></div>

        <div class="health"><span class="current"></span>&nbsp;/&nbsp;<span class="max"></span></div>

      </div>

      <div class="enemy-ship">

       

      </div>

    </div>

    <div id="score">

      <div class="hand-name">Hand Type: <span></span></div>
      <div class="number damage">0</div>
      <div class="number power">1</div>
      <div class="damage-amounts">
        <div class="total-damage">Round: <span></span></div>
        <div class="cumulative-damage">Total: <span></span></div>
      </div>

    </div>

    <div id="boosters"></div>

    <div id="game-info">

      <div id="credits"></div>

      <div class="lives"><div>Lives:&nbsp;</div><span class="total"></span></div>

      <div class="discard"><div>Discards:&nbsp;</div><span class="total"></span></div>

      <div class="attack"><div>Attacks:&nbsp;</div><span class="total"></span></div>

      <div class="button" id="view-deck">View Deck</div>

      <input id="custom-seed" type="text" placeholder="Custom Seed..." />

    </div>

    <div id="player">

      <div id="guns">

        <div class="gun-slot"></div>
        <div class="gun-slot"></div>
        <div class="gun-slot"></div>
        <div class="gun-slot"></div>
        <div class="gun-slot"></div>

      </div>

      <div class="ship-wrapper">

        <div id="discard-button" class="discard"><div>DISCARD</div><span class="remaining"></span><span>&nbsp;/&nbsp;</span><span class="total"></span></div>

        <div class="ship">PLAYER SHIP</div>

        <div id="attack-button" class="attack"><div>ATTACK</div><span class="remaining"></span><span>&nbsp;/&nbsp;</span><span class="total"></span></div>

      </div>

    </div>  

    <div id="cards"></div>

  </div>

</body>
</html>