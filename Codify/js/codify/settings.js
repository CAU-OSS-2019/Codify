'use strict';

import {
    setTheme
} from "/js/codify/set_theme.js";

let selectedTheme = document.getElementById("selected-theme");

selectedTheme.onchange = () => {
    let selectedColor = selectedTheme.options[selectedTheme.selectedIndex].id;

    // If select theme is not null value then change theme.
    if(selectedColor !== "") {
        setTheme(selectedColor);
    }
};