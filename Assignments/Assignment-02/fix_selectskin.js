// // This is the corrected selectSkin function
// function selectSkin(skin) {
//   selectedSkin = skin;
//   const skinOptions = document.querySelectorAll(".skin-option");
//   skinOptions.forEach((option) => {
//     option.style.borderColor = "#ddd";
//     option.style.backgroundColor = "white";
//   });
//   event.currentTarget.style.borderColor = "#4CAF50";
//   event.currentTarget.style.backgroundColor = "#e8f5e9";
  
//   // Update CSS variables for current skin
//   updateSkinAssets();
//   // Only redraw if game has been started (isGameStarted is true)
//   if (isGameStarted) {
//     redrawGameField(gameTiles2d, headTile, bodyTiles);
//   }
// }
