/**
 * Copyright © 2019-2025 Wo-r (https://github.com/wo-r)
 * 
 * Dependencys:
 *  - jQuery v3.7.1
 *  - Tailwind v3.4.6
 *  - SnowStorm v1.0.0 by Facebook (Meta)
 *  - EmailJS v4.0.3
 * 
 * Website: https://wo-r.github.io/
 * Built: 2025-01-17T00:00Z
 */
( async function ( $, window, document ) {

    // Used to throw exceptions when non-strict code accesses strict mode (https://javascript.info/strict-mode)
    "use strict";



    // Not a common variable used however, it is used in some specific cases.
    var isReady = $( window ).ready;

    var prevErr = async function( callback ) { try { return await callback() } catch ( e ) { console.error( e ) } };

    /**
     * Really simple thing, but checks if you are localhost, allowing developer features for website testing and such.
     */
    var isDeveloper = window.location.href.includes("127.0.0.1") ? true : false;

    var pathname = window.location.pathname;
    
    var currentDate = new Date().getFullYear();

    var osType = navigator.platform.includes( "Win" ) ? "Windows" : navigator.platform.includes( "Mac" ) ? "Mac" : navigator.platform.includes( "Linux" ) ? "Linux" : "Unknown";
    
    var githubAPI = ( username, additonalData = "" ) => { return `https://api.github.com/users/${ username }${ additonalData }` };

    /**
     * Lists all github accounts by priority
     * 
     * - [0] Wo-r
     * - [1] Wo-r Professional
     * - [2] Gradpass
     */
    var githubAccounts = [ "wo-r", "wo-r-professional", "gradpass" ];
    
    /**
     * Lists all best github repositorys by priority
     */
    var githubBestRepositorys = [ "gradpass.github.io", "echo-plus", "emulating-the-nintendo-switch", "understanding-human-behavior" ];

    var blogsPath = "../blogs/blogs.json";

    var highlighter = `<span class="text-brown-light">$&</span>`;

    var gallerysPath = "../portfolio/gallerys/gallerys.json";

    // EmailJS public key (this cannot be used against me since I set it up to ONLY work for my website url).
    var publicEmailOptions = {
        key: "9ac5poQVMm8gyPC01",
        service: "gmail_sender_98wERH34",
        form: "feedback_form_98yuadsf9u",
    }

    var currentDateYMDFormat = new Date().toISOString().split( "T" )[ 0 ];

    // Checks if an element is disabled NOTE: the element MUST NOT BE FORMATTED IN JQUERY!
    var isElementDisabled = function ( callback ) { return $( callback ).attr( "disabled" ) !== undefined ? true : false };

    // Determines if themes apply to the current page.
    var themeDisabled = window.location.href.includes( "blogs/blog" ) ? true : false;

    /**
     * Consists of storage objects (READ-ONLY)
     */
    var storageManager = {
        theme: localStorage.getItem( "theme" ) == null ? undefined : localStorage.getItem( "theme" ),
        sideMenu: localStorage.getItem( "sideMenu" ) == null ? undefined : localStorage.getItem( "sideMenu" ),
        lastUpdated: localStorage.getItem( "lastUpdated" ) == null ? undefined : localStorage.getItem( "lastUpdated" ),
        totalFollowers: localStorage.getItem( "totalFollowers" ) == null ? undefined : localStorage.getItem( "totalFollowers" ),
        totalRepos: localStorage.getItem( "totalRepos" ) == null ? undefined : localStorage.getItem( "totalRepos" ),
        bestRepos: localStorage.getItem( "bestRepos" ) == null ? undefined : localStorage.getItem( "bestRepos" ),

        // Exists for times when we need just the raw name instead of the storage item.
        raw: {
            theme: "theme",
            sideMenu: "sideMenu",
            lastUpdated: "lastUpdated",
            totalFollowers: "totalFollowers",
            totalRepos: "totalRepos",
            bestRepos: "bestRepos",
        }
    }

    /**
     * Consists of storage objects (EDIT-ONLY)
     */
    var storageEditorManager = {
        edit: ( Object, Val ) => {
            if ( typeof Object !== "string" ) return;

            // If the object is unknown
            if ( localStorage.getItem( Object ) == undefined ) localStorage.setItem( Object, "" );

            // If its not unknown
            if ( localStorage.getItem( Object ) != undefined ) localStorage.setItem( Object, Val );
        }
    }

    /**
     * Same as storageManager, however it manages various elements (READ,EDIT)
     */
    var elementsManager =  {
        themeManager: $( "#themeManagerCSS" ).length == 0 ? undefined : $( "#themeManagerCSS" ),
        navigation: $( "#navbar" ).length == 0 ? undefined : $( "#navbar" ),
        body: $( "#main" ).length == 0 ? undefined : $( "#main" ),
        disabled: $( "[disabled]" ).length == 0 ? undefined : $( "[disabled]" ),
        ripple: $( "[ripple]" ).length == 0 ? undefined : $( "[ripple]" ),
        tooltip: $( "[tooltip]" ).length == 0 ? undefined : $( "[tooltip]" ),
        goto: $( "[goto]" ).length == 0 ? undefined : $( "[goto]" ),
        footer: $( "#footer" ).length == 0 ? undefined : $( "#footer" ),
        loader: $( "#loader" ).length == 0 ? undefined : $( "#loader" ),
        popup: $( "[popup]" ).length == 0 ? undefined : $( "[popup]" ),
        latestBlogs: $( "#previewBlogs" ).length == 0 ? undefined : $( "#previewBlogs" ),
        themeToggle: $( "#themeToggle" ).length == 0 ? undefined : $( "#themeToggle" ),
        totalFollowers: $( "#totalFollowers" ).length == 0 ? undefined : $( "#totalFollowers" ), 
        totalRepos: $( "#totalRepos" ).length == 0 ? undefined : $( "#totalRepos" ),
        bestRepos: $( "#bestRepos" ).length == 0 ? undefined : $( "#bestRepos" ),
        sideMenuOptions: {
            sideMenu: $( "#sidemenu" ).length == 0 ? undefined : $( "#sidemenu" ),
            backdrop: $( "#sidemenuBackdrop" ).length == 0 ? undefined : $( "#sidemenuBackdrop" ),
            toggleButton: $( "#sidemenuToggle[type='open']" ).length == 0 ? undefined : $( "#sidemenuToggle[type='open']" ),
            resumeButton: $( "#printResume[type='navbar']" ).length == 0 ? undefined : $( "#printResume[type='navbar']" ),
        },
        blogOptions: {
            totalBlogs: $( "#totalBlogs" ).length == 0 ? undefined : $( "#totalBlogs" ),
            blogs: $( "#blogs" ).length == 0 ? undefined : $( "#blogs" ),
            blogTitles: $( "#blogs a h1" ).length == 0 ? undefined : $( "#blogs a h1" ),
            search: $( "#search" ).length == 0 ? undefined : $( "#search" ),
        },
        feedbackOptions: {
            message: $( "#message" ).length == 0 ? undefined : $( "#message" ),
            email: $( "#email" ).length == 0 ? undefined : $( "#email" ),
            name: $( "#name" ).length == 0 ? undefined : $( "#name" ),
            submitButton: $( "#submit" ).length == 0 ? undefined : $( "#submit" ),
        },
        contextMenuOptions: {
            contextMenu: $( "#contextMenu" ).length == 0 ? undefined : $( "#contextMenu" ),
            backdrop: $( "#contextMenuBackdrop" ).length == 0 ? undefined : $( "#contextMenuBackdrop" ),
            //...
            settings: $( "#contextMenu #settings" ).length == 0 ? undefined : $( "#contextMenu #settings" ),
            settingsModal: $( "#settingsModal" ).length == 0 ? undefined : $( "#settingsModal" ),
        },

        // Isn't really a stanalone part of this (only exists as a check for the page)
        galleryOptions: {
            gradpass: $( "#gradpass" ).length == 0 ? undefined : $( "#gradpass" ),
        },

        // Basically re-adds all elements and updates to have all the latest elements in them.
        update: () => {
            elementsManager.themeManager = $( "#themeManagerCSS" ).length == 0 ? undefined : $( "#themeManagerCSS" );
            elementsManager.navigation = $( "#navbar" ).length == 0 ? undefined : $( "#navbar" );
            elementsManager.body = $( "#main" ).length == 0 ? undefined : $( "#main" );
            elementsManager.disabled = $( "[disabled]" ).length == 0 ? undefined : $( "[disabled]" );
            elementsManager.ripple = $( "[ripple]" ).length == 0 ? undefined : $( "[ripple]" );
            elementsManager.tooltip = $( "[tooltip]" ).length == 0 ? undefined : $( "[tooltip]" );
            elementsManager.goto = $( "[goto]" ).length == 0 ? undefined : $( "[goto]" );
            elementsManager.footer = $( "#footer" ).length == 0 ? undefined : $( "#footer" );
            elementsManager.popup = $( "[popup]" ).length == 0 ? undefined : $( "[popup]" );
            elementsManager.latestBlogs = $( "#previewBlogs" ).length == 0 ? undefined : $( "#previewBlogs" );
            elementsManager.themeToggle = $( "#themeToggle" ).length == 0 ? undefined : $( "#themeToggle" );
            elementsManager.totalFollowers = $( "#totalFollowers" ).length == 0 ? undefined : $( "#totalFollowers" );
            elementsManager.totalRepos = $( "#totalRepos" ).length == 0 ? undefined : $( "#totalRepos" );
            elementsManager.bestRepos = $( "#bestRepos" ).length == 0 ? undefined : $( "#bestRepos" );
            elementsManager.sideMenuOptions.sideMenu = $( "#sidemenu" ).length == 0 ? undefined : $( "#sidemenu" );
            elementsManager.sideMenuOptions.backdrop = $( "#sidemenuBackdrop" ).length == 0 ? undefined : $( "#sidemenuBackdrop" );
            elementsManager.sideMenuOptions.toggleButton = $( "#sidemenuToggle[type='open']" ).length == 0 ? undefined : $( "#sidemenuToggle[type='open']" );
            elementsManager.sideMenuOptions.resumeButton = $( "#printResume[type='navbar']" ).length == 0 ? undefined : $( "#printResume[type='navbar']" );
            elementsManager.blogOptions.totalBlogs = $( "#totalBlogs" ).length == 0 ? undefined : $( "#totalBlogs" );
            elementsManager.blogOptions.blogs = $( "#blogs" ).length == 0 ? undefined : $( "#blogs" );
            elementsManager.blogOptions.blogTitles = $( "#blogs a h1" ).length == 0 ? undefined : $( "#blogs a h1" );
            elementsManager.blogOptions.search = $( "#search" ).length == 0 ? undefined : $( "#search" );
            elementsManager.galleryOptions.gradpass = $( "#gradpass" ).length == 0 ? undefined : $( "#gradpass" );
            elementsManager.feedbackOptions.message = $( "#message" ).length == 0 ? undefined : $( "#message" );
            elementsManager.feedbackOptions.email = $( "#email" ).length == 0 ? undefined : $( "#email" );
            elementsManager.feedbackOptions.name = $( "#name" ).length == 0 ? undefined : $( "#name" );
            elementsManager.feedbackOptions.submitButton = $( "#submit" ).length == 0 ? undefined : $( "#submit" );
            elementsManager.contextMenuOptions.contextMenu = $( "#contextMenu" ).length == 0 ? undefined : $( "#contextMenu" );
            elementsManager.contextMenuOptions.backdrop = $( "#contextMenuBackdrop" ).length == 0 ? undefined : $( "#contextMenuBackdrop" );
            //...
            elementsManager.contextMenuOptions.settings = $( "#contextMenu #settings" ).length == 0 ? undefined : $( "#contextMenu #settings" );
            elementsManager.contextMenuOptions.settingsModal = $( "#settingsModal" ).length == 0 ? undefined : $( "#settingsModal" );
        }
    }

    var isMobile = ( 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ) ? true : false;

    /**
     * Manages functions that cannot run more than once a day.
     */
    var dayCheckManager = {
        isNewDay: () => { return storageManager.lastUpdated !== currentDateYMDFormat },
        updateLastUpdated: () => { storageEditorManager.edit( storageManager.raw.lastUpdated, currentDateYMDFormat ) },
    }

    /**
     * Fetches stuff from a url, returns undefined if no data or an error occurs.
     */
    var get = async ( url ) => {
        return await prevErr( async function () {
            var response = await $.get( url );
            return response;
        } )
    } 

    /**
     * Retrieves data from a specific file path, mainly json.
     */
    var json = async ( path, callback ) => {
        await prevErr( async function () {
            await $.getJSON( path, callback );
        } )
    }

    /**
     * Goes through each iteration of an array.
     */
    var each = async ( array, callback ) => {
        await prevErr( async function () {
            await $.each( array, callback );
        } )
    }



    /**
     * Determines current theme and applys that theme to the current page.
     */
    async function initalizeCurrentTheme( SnowStorm ) {
        if ( themeDisabled ) return;

        // Current theme is dark.
        if ( storageManager.theme == "dark" || storageManager.theme == undefined ) {
            elementsManager.themeManager != undefined ? elementsManager.themeManager.remove() : null;
            if ( !isMobile ) {
                SnowStorm.snowColor = "#766a37";
                SnowStorm.snowCharacter = "<div class='w-full select-none'>&bull;</div>";
                SnowStorm.restartSnow();
            }
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            "brown": "#494327",
                            "brown-dark":"#0a0a08",
                            "brown-darker":"#030302",
                            "brown-light": "#766a37",
                            "brown-accent": "#968613",
                            "brown-accent-light": "#f5f69f"
                        }
                    }
                }
            }

        // Current theme is light.
        } else if ( storageManager.theme == "light" && storageManager.theme != undefined ) {
            $( "head" ).append( `<style id="themeManagerCSS"> ::selection { background: #8995c8 !important; } .ripple { background: rgb(137, 149, 200, 0.8) !important; } .loader { --c: linear-gradient(#fff 0 0); --r1: radial-gradient(farthest-side at bottom, #fff 93%, #fff); --r2: radial-gradient(farthest-side at top, #fff 93%, #fff); } </style>` );
            if ( !isMobile ) {
                SnowStorm.snowColor = "#8995c8";
                SnowStorm.snowCharacter = "<div class='w-full select-none'>&bull;</div>";
                SnowStorm.restartSnow();
            }
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            "brown": "#b6bcd8",
                            "brown-dark":"#f5f5f7",
                            "brown-darker":"#fcfcfd",
                            "brown-light": "#8995c8",
                            "brown-accent": "#6979ec",
                            "brown-accent-light": "#0a0960",
                            "black": "#b6bcd8",
                            "zinc-300": "#3f3f46",
                            "gray-300": "#3f3f46",
                        }
                    }
                }
            }
        }
    }

    /**
     * Adds events and other important things so the side menu functions correctly.
     */
    async function initalizeSideMenu() {
        // Easily manages the closed and opened states of the menu
        var PropMenuState = function ( callback ) {
            var isMenuOpened = callback;
            storageEditorManager.edit( storageManager.raw.sideMenu, isMenuOpened ? "opened" : "closed" );

            isMenuOpened ? elementsManager.sideMenuOptions.toggleButton.addClass( "invisible" ) : elementsManager.sideMenuOptions.toggleButton.removeClass( "invisible" );
            isMenuOpened ? elementsManager.sideMenuOptions.resumeButton.addClass( "invisible" ) : elementsManager.sideMenuOptions.resumeButton.removeClass( "invisible" );
            isMenuOpened ? elementsManager.navigation.addClass( "hidden" ).parent().addClass( "hidden" ) : elementsManager.navigation.removeClass("hidden").parent().removeClass("hidden");
            isMenuOpened ? elementsManager.footer.addClass( "hidden" ) : elementsManager.footer.removeClass( "hidden" );
            isMenuOpened ? elementsManager.sideMenuOptions.backdrop.removeClass( "hidden" ) : elementsManager.sideMenuOptions.backdrop.addClass( "hidden" );
            isMenuOpened ? elementsManager.sideMenuOptions.sideMenu.removeClass( "invisible" ) : elementsManager.sideMenuOptions.sideMenu.addClass( "invisible" );
        }

        // If the menu state is still opened when they load the page again
        if ( !isMobile && storageManager.sideMenu === "opened" ) {
            elementsManager.sideMenuOptions.toggleButton.addClass( "invisible" );
            elementsManager.sideMenuOptions.resumeButton.addClass( "invisible" );
            elementsManager.navigation.addClass( "hidden" ).parent().addClass( "hidden" );
            elementsManager.footer.addClass( "hidden" );
            elementsManager.sideMenuOptions.backdrop.removeClass( "hidden" );
            elementsManager.sideMenuOptions.sideMenu.removeClass( "invisible" ).css( "width", "280px" );
        }

        $( "#sidemenuToggle, #sidemenuBackdrop" ).on( "click mousedown", function (e) {
            var isMenuOpened = $( e.target ).parent().parent().attr( "type" ) === "open";

            // Menu is opened
            if ( isMenuOpened ) {
                var menuWidth = 0;
                const increaseWidth = setInterval( function () {
                    if ( menuWidth >= 280 ) {
                        clearInterval( increaseWidth );
                        PropMenuState( true );
                    } else {
                        menuWidth += 40;
                        elementsManager.sideMenuOptions.sideMenu.css( "width", `${menuWidth}px` );
                    }
                } );

            // Menu is closed
            } else {
                let menuWidth = 280;
                const decreaseWidth = setInterval( function () {
                    if ( menuWidth === 0 ) {
                        clearInterval( decreaseWidth );
                        PropMenuState( false );
                    } else {
                        menuWidth -= 40;
                        elementsManager.sideMenuOptions.sideMenu.css( "width", `${menuWidth}px` );
                    }
                } );
            }
        } )
    }

    /**
     * Dynamically appends all elements that have changes that occur too often in them.
     */
    async function initalizeDynamicElements() {
        // Determines the backslash amount to file locations by the amount of forward slashes in the current URL.
        var slashPath = "./";
        for ( let i = 0; i < pathname.split( "/" ).length-2; i++ ) {
            slashPath += "../";
        }

        var elementComponents = {
            navigation: {
                target: $( "#navbar" ),
                source: `
                    <div class="flex flex-row gap-2">
                        <a id="printResume" type="navbar" tooltip="Quickly print out my entire resume for reviewing" class="cursor-pointer">
                            <div ripple class="relative overflow-hidden hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition rounded-xl z-20">
                                <svg class="p-2 pt-[5px]" viewbox="-14 -1000 1000 1000" width="45px" height="45px">    
                                    <path class="fill-gray-300 pointer-events-none" d="M330-54q-57 0-96.5-38.8T194-190v-44h-30q-57 0-96.5-39.5T28-370v-144q0-68 47.04-116T189-678h582q68.17 0 114.59 48Q932-582 932-514v144q0 57-39.5 96.5T796-234h-30v44q0 58.4-39.5 97.2Q687-54 630-54H330Zm436-670H194v-29q0-58.4 39.5-97.2Q273-889 330-889h300q57 0 96.5 38.8T766-753v29Zm-76.5 321q25.5 0 42.5-16.81 17-16.82 17-41.69 0-25.5-16.81-43T689.5-522q-24.5 0-42 17.5t-17.5 43q0 24.5 17.5 41.5t42 17ZM330-183h300v-64H330v64Z">
                                </svg>
                            </div>
                        </a>
                        <a id="sidemenuToggle" type="open" class="cursor-pointer">
                            <div class="relative overflow-hidden hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition rounded-xl">
                                <svg class="p-2 pt-[5px]" viewbox="0 0 50 45" width="45px" height="45px">    
                                    <path class="fill-gray-300 pointer-events-none" d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z">
                                </svg>
                            </div>
                        </a>
                    </div>
                    <div class="flex flex-row items-center">
                        <a goto="https://github.com/wo-r" class="cursor-pointer" tooltip="View my github page">
                            <div ripple class="relative overflow-hidden hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition rounded-xl">
                                <img class="w-[45px] h-[45px] p-2 rounded-full" src="${ slashPath }src/logo/logo-full.jpg">
                            </div>
                        </a>
                    </div>
                `,
            },
            sideMenu: {
                target: $( "#sidemenuContainer" ),
                source: `
                    <div id="sidemenuBackdrop" class="hidden xl:hidden z-30 fixed inset-[-1000px] bg-black opacity-50 cursor-pointer"></div>
                    <div id="sidemenu" class="z-50 flex-shrink-0 absolute bottom-0 top-0 right-0 xl:relative overflow-x-hidden bg-brown-darker select-none" style="width: 0px;">
                        <div class="h-full w-[280px]">
                            <div class="flex h-full min-h-0 flex-col">
                                <div class="h-full w-full flex-1 items-start">
                                    <div class="flex h-full w-full flex-col">
                                        <div class="flex justify-between py-3 px-4">
                                            <a goto="https://github.com/wo-r" class="cursor-pointer" tooltip="View my github page">
                                                <div ripple class="relative overflow-hidden hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition rounded-xl">
                                                    <img class="w-[45px] h-[45px] p-2 rounded-full" src="${ slashPath }src/logo/logo-full.jpg">
                                                </div>
                                            </a>
                                            <div class="flex flex-row gap-2">
                                                <a id="printResume" type="sidemenu" tooltip="Quickly print out my entire resume for reviewing" class="cursor-pointer">
                                                    <div ripple class="relative overflow-hidden hover:bg-brown-light hover:bg-opacity-20 transition rounded-xl z-20">
                                                        <svg class="p-2 pt-[5px]" viewbox="-14 -1000 1000 1000" width="45px" height="45px">    
                                                            <path class="fill-zinc-300 pointer-events-none" d="M330-54q-57 0-96.5-38.8T194-190v-44h-30q-57 0-96.5-39.5T28-370v-144q0-68 47.04-116T189-678h582q68.17 0 114.59 48Q932-582 932-514v144q0 57-39.5 96.5T796-234h-30v44q0 58.4-39.5 97.2Q687-54 630-54H330Zm436-670H194v-29q0-58.4 39.5-97.2Q273-889 330-889h300q57 0 96.5 38.8T766-753v29Zm-76.5 321q25.5 0 42.5-16.81 17-16.82 17-41.69 0-25.5-16.81-43T689.5-522q-24.5 0-42 17.5t-17.5 43q0 24.5 17.5 41.5t42 17ZM330-183h300v-64H330v64Z">
                                                        </svg>
                                                    </div>
                                                </a>
                                                <a id="sidemenuToggle" type="close" class="cursor-pointer">
                                                    <div class="relative overflow-hidden hover:bg-brown-light hover:bg-opacity-20 transition rounded-xl z-20">
                                                        <svg class="p-2 pt-[5px]" viewbox="0 0 50 45" width="45px" height="45px">    
                                                            <path class="fill-zinc-300 pointer-events-none" d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z">
                                                        </svg>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-[10px] overflow-y-auto py-5">
                                            <div class="flex flex-col gap-1 py-3 px-4">
                                                <span class="font-black font-nunitoblack text-sm px-3 pb-2">OVERVIEW</span>
                                                <a goto="/" class="cursor-pointer">
                                                    <div ripple class="relative overflow-hidden py-2 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                        Home
                                                    </div>
                                                </a>
                                                <a goto="/blogs/" class="cursor-pointer">
                                                    <div ripple class="relative overflow-hidden py-2 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                        Blogs
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="flex flex-col gap-1 py-3 px-4">
                                                <span class="font-black font-nunitoblack text-sm px-3 pb-2">FOR BUSINESS</span>
                                                <a goto="/resume/" class="cursor-pointer">
                                                    <div ripple class="relative overflow-hidden py-2 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                        Resume
                                                    </div>
                                                </a>
                                                <a goto="/portfolio/" class="cursor-pointer">
                                                    <div ripple class="relative overflow-hidden py-2 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                        Portfolio
                                                    </div>
                                                </a>
                                                <a goto="" class="cursor-pointer" disabled>
                                                    <div ripple class="relative overflow-hidden py-2 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                        Certifications
                                                    </div>
                                                </a>
                                                <a goto="" class="cursor-pointer" disabled>
                                                    <div ripple class="relative overflow-hidden py-2 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                        Experience
                                                    </div>
                                                </a>
                                                <a goto="" class="cursor-pointer" disabled>
                                                    <div ripple class="relative overflow-hidden py-2 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                        Education
                                                    </div>
                                                </a>
                                                <a goto="/contact/" class="cursor-pointer">
                                                    <div ripple class="relative overflow-hidden py-2 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                        Contact Me
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="flex flex-col gap-1 py-3 px-4">
                                                <span class="font-black font-nunitoblack text-sm px-3 pb-2">SOCIALS</span>
                                                <a goto="" class="cursor-pointer" disabled>
                                                    <div ripple class="relative overflow-hidden py-2 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                        LinkedIn
                                                    </div>
                                                </a>
                                                <a goto="https://www.youtube.com/@thatguywoods" tooltip="Check out my youtube channel where I make videos" class="cursor-pointer">
                                                    <div ripple class="relative overflow-hidden py-2 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                        Youtube
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        ${ themeDisabled == false ? `
                                            <div class="flex justify-between py-3 px-4">
                                                <div></div>
                                                <div class="flex flex-row gap-2">
                                                    <a id="themeToggle" type="close" class="cursor-pointer">
                                                        <div ripple class="relative overflow-hidden hover:bg-brown-light hover:bg-opacity-20 transition rounded-xl z-20">
                                                            <svg class="p-2 pt-[6px]" viewbox="0 -960 960 960" width="45px" height="45px">    
                                                                <path class="fill-zinc-300 pointer-events-none" d="M481-100q-164 0-272.5-108T100-480q0-115 59-213.5T341-837q29-10 53-9t40 13q17 11 25.5 31.5T466-752q2 16 1 28.5t-1 22.5q0 99 70 168t170 69q12 0 25 .5t26 2.5q29-2 48.5 6t29.5 24q11 16 11.5 38t-9.5 51q-44 109-140 175.5T481-100Z">
                                                            </svg>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>    
                                        ` : "" }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
            },
            footer: {
                target: $( "#footer" ),
                source: `
                    <div class="py-5 px-6 w-full">
                        <div class="flex justify-between items-center">
                            <div class="flex flex-1">Copyright &copy; Wo-r 2019-${ currentDate }</div>
                            <div class="flex flex-row gap-2 flex-2">
                                <a goto="" tooltip="View my LinkedIn page to get a true full view of all my achievements" class="cursor-pointer" disabled>
                                    <div ripple class="relative overflow-hidden hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition rounded-xl z-20">
                                        <svg class="p-2 pt-[3px]" viewbox="0 0 30 25" width="45px" height="45px">    
                                            <path class="fill-gray-300 pointer-events-none" d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M10.954,22h-2.95 v-9.492h2.95V22z M9.449,11.151c-0.951,0-1.72-0.771-1.72-1.72c0-0.949,0.77-1.719,1.72-1.719c0.948,0,1.719,0.771,1.719,1.719 C11.168,10.38,10.397,11.151,9.449,11.151z M22.004,22h-2.948v-4.616c0-1.101-0.02-2.517-1.533-2.517 c-1.535,0-1.771,1.199-1.771,2.437V22h-2.948v-9.492h2.83v1.297h0.04c0.394-0.746,1.356-1.533,2.791-1.533 c2.987,0,3.539,1.966,3.539,4.522V22z">
                                        </svg>
                                    </div>
                                </a>
                                <a goto="https://www.youtube.com/@thatguywoods" tooltip="Check out my youtube channel where I make videos" class="cursor-pointer">
                                    <div ripple class="relative overflow-hidden hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition rounded-xl z-20">
                                        <svg class="p-2 pt-[3px]" viewbox="0 0 50 45" width="45px" height="45px">    
                                            <path class="fill-gray-300 pointer-events-none" d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z">
                                        </svg>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                `,
            },
            contextMenu: {
                target: $( "#contextMenu" ),
                source: `
                    <div id="contextMenuBackdrop" class="hidden z-[150] fixed inset-[-1000px] cursor-pointer"></div>
                    <div id="contextMenu" class="absolute hidden shadow-xl z-[200] bg-brown-dark text-zinc-300 rounded-lg shadow-lg w-52 select-none">
                        <div class="flex flex-col p-0 m-0">
                            <div ripple id="copy" class="cursor-pointer relative overflow-hidden py-3 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-t-lg transition">
                                <div class="flex flex-row justify-between items-center">
                                    <span>Copy</span>
                                    ${ osType == "Windows" ? `<span class="text-sm opacity-20">CTRL + C</span>` : osType == "Mac" ? `<span class="text-sm opacity-20">⌘ + C</span>` : "" }
                                </div>
                            </div>
                            <div ripple id="paste" class="cursor-pointer relative overflow-hidden py-3 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition">
                                <div class="flex flex-row justify-between items-center">
                                    <span>Paste</span>
                                    ${ osType == "Windows" ? `<span class="text-sm opacity-20">CTRL + V</span>` : osType == "Mac" ? `<span class="text-sm opacity-20">⌘ + V</span>` : "" }
                                </div>
                            </div>
                            <div ripple id="forward" class="cursor-pointer relative overflow-hidden py-3 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition">Forward</div>
                            <div ripple id="back" class="cursor-pointer relative overflow-hidden py-3 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition">Back</div>
                            <hr class="border-brown-light border-[1.2px] rounded-full">
                            <div ripple id="reload" class="cursor-pointer relative overflow-hidden py-3 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition">
                                <div class="flex flex-row justify-between items-center">
                                    <span>Reload</span>
                                    ${ osType == "Windows" ? `<span class="text-sm opacity-20">F5</span>` : "" }
                                </div>
                            </div>
                            <div ripple id="fullscreen" class="cursor-pointer relative overflow-hidden py-3 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition">
                                <div class="flex flex-row justify-between items-center">
                                    <span>Fullscreen</span>
                                    ${ osType == "Windows" ? `<span class="text-sm opacity-20">F11</span>` : "" }
                                </div>
                            </div>
                            <hr class="border-brown-light border-[1.2px] rounded-full">
                            <div ripple id="settings" class="cursor-pointer relative overflow-hidden py-3 px-3 font-semibold hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-b-lg transition">Settings</div>
                        </div>
                    </div>
                `,
            }
        };

        // As long as all elements exists, apply each elements contents.
        if ( elementComponents.navigation.target.length && elementComponents.sideMenu.target.length && elementComponents.footer.target.length ) {
            await elementComponents.navigation.target.append( elementComponents.navigation.source );
            await elementComponents.sideMenu.target.append( elementComponents.sideMenu.source );
            await elementComponents.footer.target.append( elementComponents.footer.source );
            await $( "body" ).append( elementComponents.contextMenu.source );
        }
    }

    /**
     * Adds ripple effects to elements with [ripple] attribute applied.
     */
    async function initalizeRippledElements() {
        if ( isMobile ) return;

        elementsManager.ripple.mousedown( function (e) {
            const rippleTarget = $( this );
            const rippleCircle = $( "<span></span>" );
            const rippleDiameter = Math.max( rippleTarget.width(), rippleTarget.height() );
            const rippleRadius = rippleDiameter / 2;

            const offsetX = event.clientX - rippleTarget.offset().left - rippleRadius;
            const offsetY = event.clientY - rippleTarget.offset().top - rippleRadius;

            rippleCircle.css( {
                width: rippleDiameter,
                height: rippleDiameter,
                left: offsetX,
                top: offsetY
            } ).addClass( "ripple" );

            rippleTarget.append( rippleCircle );
            rippleCircle.on( "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
                rippleCircle.remove();
            } );
        } )
    }

    /**
     * Adds tooltips to elements with [tooltip] attribute applied
     */
    async function initalizeTooltipElements() {
        if ( isMobile ) return;

        var tooltip = $( `<div class="tooltip bg-brown-dark rounded-xl font-semibold p-5 text-zinc-300 font-black z-50 select-none shadow-xl"></div>` ).appendTo( "body" );
        var isTooltipVisible = false;

        elementsManager.tooltip.hover( function () {
            tooltip.text( $( this ).attr( "tooltip" ) ).addClass( "show" );
            isTooltipVisible = true;
        }, function () {
            tooltip.removeClass( "show" );
            isTooltipVisible = false;
        } )

        $( document ).mousemove( function (e) {
            if ( isTooltipVisible ) {
                var tooltipWidth = tooltip.outerWidth();
                var tooltipHeight = tooltip.outerHeight();
                var tooltipX = event.pageX + 10;
                var tooltipY = event.pageY + 10;

                if ( tooltipX+tooltipWidth > $( window ).width() ) tooltipX = event.pageX - tooltipWidth-10;
                if ( tooltipY+tooltipHeight > $ (window ).height() ) tooltipY = event.pageY - tooltipHeight-10;
                if ( tooltipX < 0 ) tooltipX = 10;
                if ( tooltipY < 0 ) tooltipY = event.pageY+10;

                tooltip.css( { left: tooltipX, top: tooltipY } );
            }
        } )
    }

    /**
     * Manages elements with the attribute "disabled".
     */
    async function initalizeDisabledElements() {
        elementsManager.disabled.each(function () {
            let disabled = $(this);
            disabled.attr( "tooltip", "This is currently not available" );
            disabled.find( "[ripple]" ).off().removeAttr( "ripple" );
            disabled.children().addClass( "hover:opacity-20" ).parent().addClass( "select-none cursor-not-allowed" ).click( function ( e ) {
                e.preventDefault();
            } )
        })
    }

    /**
     * Completely replacing the href attribute, this attribute ([goto]) allows you to not see a box showing the link, and performs the same functionalities as [href].
     */
    async function initalizeAlternateLinks() {
        elementsManager.goto.click( function () {
            if ( isElementDisabled( this ) ) return;

            var goto = $( this ).attr( "goto" );
            if ( goto === "#" || goto === "" ) return;

            // Targets a website
            if ( goto.startsWith( "https://" ) ) {
                window.open( goto, "_blank" );
            
            // Targets a fragment identifier
            // TODO: fix (doesn't scroll to stuff)
            } else if ( goto.startsWith( "#" ) ) {
                if ( goto.length ) {
                    elementsManager.body.parent().animate( {
                        scrollTop: $( $( this ).attr( "goto" ) ).offset().top - elementsManager.body.offset().top-200,
                    }, 800 );
                }

            // Targets a specific file on the website
            } else if ( goto.startsWith( "/" ) ) {
                // TODO: this may or may not happen but... I may make it so instead of opening the page, we just fetch the page data, load the page on the current page
                // to prevent the dumb loading from changing colors if the user decides to use light mode for like a split second or 2 making it obvious the original theme is dark.
                elementsManager.loader.fadeIn( 300 );
                setTimeout( () => {
                    window.location.href = goto;
                }, 300 )

            // Targets an email address for mailing purposes
            } else if ( goto.startsWith( "mailto:" ) ) {
                window.location.href = goto;
            }
        } )
    }

    /**
     * Dynamically hides the navigation when the user scrolls down, and will re-appear if the user scrolls back up.
     */
    async function dynamicNavigationScroll() {
        if ( isMobile ) return;

        var previousPos = elementsManager.body.parent().scrollTop();
        await elementsManager.body.parent().scroll( function () {
            var currentPos = elementsManager.body.parent().scrollTop();
            var bodyContentsHeight = elementsManager.body[0].scrollHeight;
            var viewportHeight = elementsManager.body.parent()[0].clientHeight + 100; // +100 offset
            
            // Less-Than-Equal to viewports height
            if ( bodyContentsHeight <= viewportHeight ) {
                elementsManager.navigation.parent().removeClass( "opacity-0" ).addClass( "py-3 px-4" ).find( "#navbar" ).removeClass( "h-0" );
                return;
            }

            // More-Than-Equal to bodys height (-20 offset)
            if ( currentPos+viewportHeight >= bodyContentsHeight-20 ) {
                elementsManager.navigation.parent().addClass( "opacity-0" ).removeClass( "py-3 px-4" ).find( "#navbar" ).addClass( "h-0" );
            } else {
                // More-Than-Equal to the current position
                if ( previousPos > currentPos ) {
                    elementsManager.navigation.parent().removeClass( "opacity-0" ).addClass( "py-3 px-4" ).find( "#navbar" ) .removeClass( "h-0" );
                } else {
                    elementsManager.navigation.parent().addClass( "opacity-0" ).removeClass( "py-3 px-4" ).find( "#navbar" ).addClass( "h-0" );
                }
            }

            // Update the previous position to match current position
            previousPos = currentPos;
        } );
    }

    /**
     * Adds animated text that pops up.
     */
    async function animatePopupText() {
        if ( isMobile ) {
            elementsManager.popup.each( function () {
                $( this ).removeClass( "invisible" );
            } );
        } else {
            var animatePopupText = function ( element ) {
                $ ( element ).removeClass( "invisible" );
            
                let text = $( element ).text();
                let wrappedText = "";
                let speed = "slow"; // Default speed
            
                // Check for speed attribute and set the speed accordingly
                if ( $( element ).attr( "fast" ) !== undefined ) speed = "fast";
                else if ( $( element ).attr( "moderate" ) !== undefined ) speed = "moderate";
                else if ( $( element ).attr( "veryFast" ) !== undefined ) speed = "veryFast";
                else if ( $( element ).attr( "extremelyFast" ) !== undefined ) speed = "extremelyFast";
            
                // Adjust the delay based on the speed
                const delay = {
                    fast: 50,
                    moderate: 100,
                    veryFast: 30,
                    extremelyFast: 5,
                    slow: 200
                }[speed];
            
                // Split the text into words and wrap each word in a span
                const words = text.split( " " );
                words.forEach( function ( word ) {
                    if ( word.trim() ) {
                        wrappedText += `<div class="popup-word flex flex-row">${ word.split( "" ).map( function ( letter ) {
                            return `<span class="popup-letter">${ letter }</span>`;
                        } ).join( "" ) }</div> `;
                    } else {
                        wrappedText += `<span class="popup-letter">&nbsp;</span>`;
                    }
                } );
            
                $( element ).html( wrappedText );
            
                $( element ).find( ".popup-letter" ).each( function ( index ) {
                    $( this ).delay( delay * index ).queue( function ( next ) {
                        $( this ).addClass( "show" );
                        next();
                    } );
                } );
            }
            
            // Intersection Observer to animate popup text when it becomes visible
            var observer = new IntersectionObserver(function (entries, observer) {
                entries.forEach( function ( entry ) {
                    if ( entry.isIntersecting ) {
                        animatePopupText( entry.target );
                        observer.unobserve( entry.target );
                    }
                });
            }, { threshold: 0.5 });
            
            elementsManager.popup.each( function () {
                observer.observe( this );
            } );
        }
    }

    /**
     * Creates a alternate right click menu for desktop users which has functionalities of the right click menu, without the clutter most right click menus consist of.
     */
    async function initalizeContextMenu() {
        if ( isMobile ) return;

        return;
        
        $( document ).on( "contextmenu", function (e) {
            e.preventDefault();

            if ( elementsManager.contextMenuOptions.settingsModal ) return;
            
            var contextMenuWidth = elementsManager.contextMenuOptions.contextMenu.outerWidth();
            var contextMenuHeight = elementsManager.contextMenuOptions.contextMenu.outerHeight();
            var contextMenuX = e.pageX + 10;
            var contextMenuY = e.pageY + 10;

            if ( contextMenuX+contextMenuWidth > $( window ).width() ) contextMenuX = e.pageX - contextMenuWidth-10;
            if ( contextMenuY+contextMenuHeight > $( window ).height() ) contextMenuY = e.pageY - contextMenuHeight-10;
            if ( contextMenuX < 0 ) contextMenuX = 10;
            if ( contextMenuY < 0 ) contextMenuY = e.pageY+10;

            elementsManager.contextMenuOptions.contextMenu.css( {
                left: contextMenuX-10,
                top: contextMenuY-12,
            } ).removeClass( "hidden" );

            elementsManager.contextMenuOptions.backdrop.removeClass( "hidden" );
        } );

        elementsManager.contextMenuOptions.backdrop.on( "click mousedown", function () {
            elementsManager.contextMenuOptions.contextMenu.addClass( "hidden" );
            elementsManager.contextMenuOptions.backdrop.addClass( "hidden" );
        } )

        // Events for context menu
        

        // Settings manages a wide range of things the website does, this allows edits to the runtime functions
        elementsManager.contextMenuOptions.settings.mousedown( function () {
            elementsManager.contextMenuOptions.contextMenu.addClass( "hidden" )
            elementsManager.contextMenuOptions.backdrop.addClass( "hidden" );

            //TODO:
            $( "body" ).find( "div[class='h-\[100vh\]']" ).append( `
                <div id="settingsModal" class="fixed inset-0 z-[50] select-none">
                    <div id="settingsModalBackdrop" class="fixed inset-0 z-[-1] bg-brown-darker bg-opacity-50"></div>
                    <div class="flex items-center justify-center min-h-screen">
                        <div class="bg-brown-dark p-6 rounded-lg shadow-lg w-80">
                            <h2 class="text-5xl font-black mb-4">Settings</h2>

                            <form class="text-zinc-300 flex flex-col gap-5">
                                <div class="mb-3">
                                    <label for="dropdownTheme" class="block text-md font-medium">Theme:</label>
                                    <select id="dropdownTheme" name="theme" class="mt-1 block w-full px-3 py-2 bg-brown-darker appearance-none rounded-md outline-none bg-brown-dark">
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </div>
                        
                                <label class="flex justify-between items-center cursor-pointer">
                                    <input type="checkbox" checked class="sr-only peer">
                                    <span class="text-md font-medium text-zinc-300">SnowStorm <small class="text-[8px] opacity-50">By Facebook</small></span>
                                    <div class="relative w-11 h-6 bg-brown peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.8px] after:start-[1.8px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brown-light"></div>
                                </label>
                                <label class="flex justify-between items-center cursor-pointer">
                                    <input type="checkbox" checked class="sr-only peer">
                                    <span class="text-md font-medium text-zinc-300">Popup Animations</span>
                                    <div class="relative w-11 h-6 bg-brown peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.8px] after:start-[1.8px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brown-light"></div>
                                </label>
                                <label tooltip="Removes literally every function from the site except core functions" class="flex justify-between items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer">
                                    <span class="text-md font-medium text-zinc-300">Potato Mode</span>
                                    <div class="relative w-11 h-6 bg-brown peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.8px] after:start-[1.8px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brown-light"></div>
                                </label>
                            </form>
                        </div>
                    </div>
                </div>    
            ` )
        
            elementsManager.update();
            initalizeRippledElements();
            initalizeTooltipElements();

            elementsManager.contextMenuOptions.settingsModal.find( "#settingsModalBackdrop" ).mousedown( function ( e ) {
                elementsManager.contextMenuOptions.settingsModal.remove();
                elementsManager.update();
            } )

        } );
    }

    /**
     * Previews the 3 newest blogs from the json file.
     */
    async function latestBlogsPreviewer() {
        if ( elementsManager.latestBlogs == undefined ) return;

        await json( "../blogs/blogs.json", function ( blogs ) {
            blogs.blogs.sort( ( a, b ) => new Date( b.created ) - new Date( a.created ) )
            blogs.blogs = blogs.blogs.filter( blog => blog.locked !== true ).slice( 0, 2 );

            each( blogs.blogs, async function ( index, { name, description, created, PATH } ) {
                let date = new Date( created ).toLocaleString();
                elementsManager.latestBlogs.append( `
                    <a goto="${ PATH }" class="cursor-pointer flex-1 select-none">
                        <div ripple class="relative overflow-hidden p-10 bg-brown-dark hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition h-full">
                            <div class="flex flex-col gap-2 h-full">
                                <h1 class="text-1xl md:text-2xl font-nunitoblack font-black leading-tight tracking-tight text-center lg:text-left lg:justify-start items-center lg:items-start">${name}</h1>
                                <span class="text-sm justify-center h-full text-center lg:text-left lg:justify-start items-center lg:items-start">${ description }</span>    
                                <span date class="text-sm justify-center text-center lg:text-left lg:justify-start items-center lg:items-start">Written ${ date.split( "," )[0] } at ${ date.split( "," )[1] }</span>    
                            </div>
                        </div>
                    </a>
                ` )
            } )

            elementsManager.update();

            initalizeAlternateLinks();
            initalizeRippledElements();
        } );
    }

    /**
     * Gets the total amount of followers from my github account
     */
    async function totalFollowerCount() {
        if ( elementsManager.totalFollowers == undefined ) return;

        if ( !dayCheckManager.isNewDay() && storageManager.totalFollowers != undefined ) {
            if ( storageManager.totalFollowers ) {
                elementsManager.totalFollowers.text( storageManager.totalFollowers );
            }

            return;
        }

        var userData = await get( githubAPI( githubAccounts[0] ) );
        var totalFollowers = userData ? userData.followers : 0;
        storageEditorManager.edit( storageManager.raw.totalFollowers, totalFollowers );
        dayCheckManager.updateLastUpdated();

        elementsManager.totalFollowers.text( totalFollowers );
    }

    /**
     * Gets the total amount of repositorys over all of my github accounts
     */
    async function totalGithubRepositorys() {
        if ( elementsManager.totalRepos == undefined ) return;

        if ( !dayCheckManager.isNewDay() && storageManager.totalRepos != undefined ) {
            if ( storageManager.totalRepos ) {
                elementsManager.totalRepos.text( storageManager.totalRepos );
            }

            return;
        }

        var totalRepos = 0;
        var usersProcessed = 0;

        // Get all accounts in list
        for ( var username of githubAccounts ) {
            var repoData = await get( githubAPI( username, "/repos?per_page=100" ) );
            if ( repoData ) totalRepos += repoData.length;

            usersProcessed++
            if ( usersProcessed === githubAccounts.length ) {
                storageEditorManager.edit( storageManager.raw.totalRepos, totalRepos );
                dayCheckManager.updateLastUpdated();

                elementsManager.totalRepos.text( totalRepos );
            }
        }
    }

    /**
     * Gets the best repositorys data automatically
     */
    async function getBestRepostiorys() {
        if ( elementsManager.bestRepos == undefined ) return;
        
        if ( !dayCheckManager.isNewDay() && storageManager.bestRepos != undefined ) {
            if ( storageManager.bestRepos ) {
                elementsManager.bestRepos.html( storageManager.bestRepos );
            }

            elementsManager.update();
            
            initalizeAlternateLinks();
            initalizeTooltipElements();
            
            return;
        }

        var bestRepos = [];

        await Promise.all( githubAccounts.map( async ( username ) => {
            var repoData = await get( githubAPI( username, "/repos?per_page=100" ) );
            if ( repoData ) {
                var filteredRepoData = repoData.filter( repoData => githubBestRepositorys.includes( repoData.name ) );
                bestRepos = bestRepos.concat( filteredRepoData );
            }
        } ) );

        // Cache the best repoistorys
        var repoHTML = "";
        bestRepos.forEach( (currentRepo) => {
            repoHTML += `
                <a goto="${ currentRepo.html_url }" tooltip="${ currentRepo.description || "No description available" }" class="cursor-pointer flex-1 text-center select-none">
                    <div class="relative overflow-hidden p-10 font-black bg-brown-dark hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition h-full flex items-center justify-center">
                        <div class="flex flex-row justify-center items-center">
                            <span>${ currentRepo.name }</span>
                        </div>
                    </div>
                </a>
            `;
        } );

        storageEditorManager.edit( storageManager.raw.bestRepos, repoHTML );
        dayCheckManager.updateLastUpdated();

        elementsManager.bestRepos.html( repoHTML );

        elementsManager.update();
            
        initalizeAlternateLinks();
        initalizeTooltipElements();
    }

    /**
     * Using blogs.json we can effectivly list all blogs.
     */
    async function blogsManager() {
        if ( elementsManager.blogOptions.totalBlogs == undefined || elementsManager.blogOptions.blogs == undefined || elementsManager.blogOptions.search == undefined ) return;

        // Developer stuff :)
        if (isDeveloper) console.log("Current Date:", new Date().toISOString());

        await json( blogsPath, function (blogs) {
            // Get total number of blogs
            if ( blogs.blogs && Array.isArray( blogs.blogs ) ) elementsManager.blogOptions.totalBlogs.text( blogs.blogs.filter( blog => !blog.locked ).length );

            // Sort blogs by latest date
            blogs.blogs.sort( ( a, b ) => new Date( b.created ) - new Date( a.created ) )
            blogs.blogs = blogs.blogs.filter( blog => blog.locked !== true );

            each( blogs.blogs, async function ( index, { name, description, created, PATH } ) {
                var date = new Date( created ).toLocaleString();

                elementsManager.blogOptions.blogs.append( `
                    <a goto="${ PATH }" class="cursor-pointer flex-1 select-none">
                        <div ripple class="relative overflow-hidden p-10 bg-brown-dark hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition h-full">
                            <div class="flex flex-col gap-2 justify-center md:justify-start items-center md:items-start h-full">
                                <h1 class="text-1xl md:text-6xl font-nunitoblack font-black leading-tight tracking-tight">${ name }</h1>
                                <span class="text-sm md:text-lg justify-center h-full text-center lg:text-left lg:justify-start items-center lg:items-start">${ description }</span>    
                                <span date class="text-sm md:text-lg justify-center text-center lg:text-left lg:justify-start items-center lg:items-start">Written ${ date.split(",")[0] } at ${ date.split(",")[1] }</span>    
                            </div>
                        </div>
                    </a>
                ` );
            } )

            elementsManager.update();

            initalizeAlternateLinks();
            initalizeRippledElements();

            // Setup the search bar so we can search for blogs.
            elementsManager.blogOptions.search.on( "input", function () {
                var search = $( this ).val();
                each( elementsManager.blogOptions.blogTitles, function () {
                    var elementBody = $( this ).parent().parent().parent();

                    // Could not find a result
                    if ( search.length === 0 ) {
                        $( this ).html( $( this ).text() ).show();
                        elementBody.fadeIn( 300 );

                    // Found a result
                    } else {
                        // Found a result with matching text
                        if ( $( this ).text().match( new RegExp( search, "gi" ) ) !== null ) {
                            var highlightedText = $( this ).text().replace( new RegExp( search, "gi" ), highlighter );
                            $( this ).html( highlightedText ).show();
                            elementBody.fadeIn( 300 );

                        // The result suddenly didn't match
                        } else {
                            elementBody.fadeOut( 300 );
                        }
                    }
                } )
            } )
        } );
    }

    /**
     * Manages the gallery carousel for the portfolio page.
     */
    async function galleryCarouselManager() {
        if ( elementsManager.galleryOptions.gradpass == undefined ) return;

        json( gallerysPath, function (gallerys) {
            each( gallerys.gallerys, function ( galleryKey, galleryImages ) {
                var galleryID = `#${ galleryKey }`;
                var currentImageIndex = 0;

                // Each time we ever click a button this gets activated.
                function updateGallery() {
                    var currentImage = galleryImages[ currentImageIndex ];
                    var imagePath = currentImage.PATH;

                    $( `${ galleryID } #gallery img` ).attr( "src", imagePath );
                    
                    // Has custom classings
                    if ( currentImage.custom_classings != "" ) $( `${ galleryID } #gallery img `).addClass( currentImage.custom_classings );

                    $( `${ galleryID } .gallery-image` ).find ( "svg" ).attr( "width", "25px" ).attr( "height", "25px" )
                        .find( "path" ).attr( "d", "M480-34q-92.64 0-174.47-34.6-81.82-34.61-142.07-94.86T68.6-305.53Q34-387.36 34-480q0-92.9 34.66-174.45 34.67-81.55 95.18-141.94 60.51-60.39 142.07-95Q387.48-926 480-926q92.89 0 174.48 34.59 81.59 34.6 141.96 94.97 60.37 60.37 94.97 141.99Q926-572.83 926-479.92q0 92.92-34.61 174.25-34.61 81.32-95 141.83Q736-103.33 654.45-68.66 572.9-34 480-34Zm-.23-136q130.74 0 220.49-89.51Q790-349.03 790-479.77t-89.51-220.49Q610.97-790 480.23-790t-220.49 89.51Q170-610.97 170-480.23t89.51 220.49Q349.03-170 479.77-170Zm.23-310Z" );

                        $( `${ galleryID } .gallery-image[image='${ currentImageIndex+1 }']` ).find( "svg" ).attr( "width", "35px" ).attr( "height", "35px" )
                        .find( "path" ).attr( "d", "M480.04-269q87.58 0 149.27-61.73Q691-392.46 691-480.04q0-87.58-61.73-149.27Q567.54-691 479.96-691q-87.58 0-149.27 61.73Q269-567.54 269-479.96q0 87.58 61.73 149.27Q392.46-269 480.04-269ZM480-34q-92.64 0-174.47-34.6-81.82-34.61-142.07-94.86T68.6-305.53Q34-387.36 34-480q0-92.9 34.66-174.45 34.67-81.55 95.18-141.94 60.51-60.39 142.07-95Q387.48-926 480-926q92.89 0 174.48 34.59 81.59 34.6 141.96 94.97 60.37 60.37 94.97 141.99Q926-572.83 926-479.92q0 92.92-34.61 174.25-34.61 81.32-95 141.83Q736-103.33 654.45-68.66 572.9-34 480-34Zm-.23-136q130.74 0 220.49-89.51Q790-349.03 790-479.77t-89.51-220.49Q610.97-790 480.23-790t-220.49 89.51Q170-610.97 170-480.23t89.51 220.49Q349.03-170 479.77-170Zm.23-310Z" );
                }

                $( `${ galleryID } .gallery-image` ).click( function () {
                    currentImageIndex = $( this ).attr( "image" )-1;
                    updateGallery();
                } )

                $( `${ galleryID } #gallery-image-decrease` ).click( function () {
                    if ( currentImageIndex > 0 ) {
                        currentImageIndex--;
                        updateGallery();
                    }
                } )

                $( `${ galleryID } #gallery-image-increase` ).click( function () {
                    if ( currentImageIndex < galleryImages.length-1 ) {
                        currentImageIndex++;
                        updateGallery();
                    }
                } )

                updateGallery();
            } )
        } )
    }

    /**
     * Using EmailJS, this allows the user to send a simple email to my personal email.
     */
    async function feedbackManager() {
        if ( elementsManager.feedbackOptions.message == undefined || elementsManager.feedbackOptions.email == undefined || elementsManager.feedbackOptions.name == undefined || elementsManager.feedbackOptions.submitButton == undefined ) return;
        
        // Dynamically adds height to the input when you go to a newline.
        elementsManager.feedbackOptions.message.on( "input", function () {
            $( this ).css( "height", "auto" );
            $( this ).css( "height", `${ this.scrollHeight }px`);

            if ( $( this ).val() != "" ) elementsManager.feedbackOptions.message.parent().removeClass( "border-2 border-red-800 animate-shake" );
        } )

        elementsManager.feedbackOptions.email.on( "input", function () {
            if ( $( this ).val() != "" ) elementsManager.feedbackOptions.email.parent().removeClass( "border-2 border-red-800 animate-shake" );
        } )

        if ( elementsManager.feedbackOptions.message && elementsManager.feedbackOptions.email ) {
            await elementsManager.feedbackOptions.submitButton.click( async function () {
                if ( elementsManager.feedbackOptions.message.val() != "" && elementsManager.feedbackOptions.email.val() != "" && elementsManager.feedbackOptions.email.val().includes( "@" ) ) {
                    function sanitizeInput( input ) {
                        if ( !input ) return "";
                        return input.trim().replace( /["'<>&]/g, function ( match ) {
                            return `&#${ match.charCodeAt( 0 ) };`;
                        } )
                    }

                    var name = elementsManager.feedbackOptions.name.val() ? sanitizeInput( elementsManager.feedbackOptions.name.val() ) : "Anonymous";
                    var email = sanitizeInput( elementsManager.feedbackOptions.email.val() );
                    var message = sanitizeInput( elementsManager.feedbackOptions.message.val() );

                    elementsManager.loader.fadeIn( 300 );

                    async function sendEmail( name, email, message ) {
                        // Initalize the email api
                        await emailjs.init( { publicKey: publicEmailOptions.key } );

                        var emailForm = {
                            name: name,
                            email: email,
                            message: message,
                        }

                        // Send the email using emailjs send function
                        await emailjs.send( publicEmailOptions.service, publicEmailOptions.form, emailForm ).then( () => {
                            // Reset the feedback form
                            elementsManager.feedbackOptions.message.val( "" );
                            elementsManager.feedbackOptions.email.val( "" );
                            elementsManager.feedbackOptions.name.val( "" );

                            elementsManager.feedbackOptions.submitButton.find( "span" ).text( "Send Message (Sent Successfully)" );
                        }, ( e ) => {
                            elementsManager.feedbackOptions.submitButton.find( "span" ).text( "Send Message (Error Occured, Check Console)" );
                            console.error( e );
                        } )

                        setTimeout( () => {
                            elementsManager.feedbackOptions.submitButton.find( "span" ).text( "Send Message" );
                        }, 5000 );
                    }

                    await sendEmail( name, email, message );

                    elementsManager.loader.fadeOut( 300 );
                } else {
                    if ( elementsManager.feedbackOptions.message.val() == "" ) elementsManager.feedbackOptions.message.parent().addClass( "border-2 border-red-800 animate-shake" );
                    if ( elementsManager.feedbackOptions.email.val() == "" || !elementsManager.feedbackOptions.email.val().includes( "@" ) ) {
                        elementsManager.feedbackOptions.email.parent().addClass( "border-2 border-red-800 animate-shake" );
                    }
                }
            } )
        }
    }



    await isReady( async function () {
        /**
         * SnowStorm v1.0.0
         * 
         * 1. `init()`: Initializes the snowstorm, sets up event listeners, and starts the snow animation if autoStart is true.
         * 3. `restartSnow()`: Restarts the snow animation after the window is resized, clearing and regenerating snowflakes.
         * 4. `start()`: Starts the snow animation, making snowflakes move according to their velocities.
         * 5. `stop()`: Stops the snow animation and halts the movement of snowflakes.
         * 9. `restartSnow()`: Clears existing snowflakes and re-creates them when the window is resized.
         */
        var SnowStorm = window.SnowStorm;
        if ( !isMobile ) SnowStorm.init();

        // Contains a long list of functions to run in order from HIGHEST priority to LOWEST priority.
        var tasks = [
            initalizeDynamicElements,
            async () => elementsManager.update(),
            initalizeSideMenu,
            async () => {
                let isToggling = false; // Flag to track if a toggle is in progress

                // Manages theme changes from the theme button
                elementsManager.themeToggle ? elementsManager.themeToggle.mousedown( function () {
                    if ( isToggling ) return; // Prevent further toggles if one is already in progress

                    isToggling = true; // Set flag to indicate toggle is in progress
                    
                    elementsManager.loader.show();

                    // First time use of this button
                    if ( storageManager.theme == undefined ) {
                        storageEditorManager.edit( storageManager.raw.theme, "light" )
                        storageManager.theme = "light";
                        elementsManager.update();
                        initalizeCurrentTheme( SnowStorm );
                    
                    // Any other time the user clicks the button
                    } else {
                        if ( storageManager.theme == "dark" ) {
                            storageEditorManager.edit( storageManager.raw.theme, "light" );
                            storageManager.theme = "light";
                            elementsManager.update();
                            initalizeCurrentTheme( SnowStorm );
                        } else {
                            storageEditorManager.edit( storageManager.raw.theme, "dark" );
                            storageManager.theme = "dark";
                            elementsManager.update();
                            initalizeCurrentTheme( SnowStorm );
                        }
                    }

                    // Reset the isToggling flag after 500ms to prevent spamming
                    setTimeout( function () {
                        isToggling = false;
                        elementsManager.loader.fadeOut(300);
                    }, 500 ); // Adjust timeout as needed
                } ) : null;
            },
            initalizeRippledElements,
            initalizeDisabledElements,
            async () => elementsManager.update(),
            initalizeTooltipElements,
            initalizeAlternateLinks,
            async () => initalizeCurrentTheme( SnowStorm ),
            initalizeContextMenu,
            dynamicNavigationScroll,
            latestBlogsPreviewer,
            async () => elementsManager.update(),
            totalFollowerCount,
            totalGithubRepositorys,
            getBestRepostiorys,
            blogsManager,
            galleryCarouselManager,
            feedbackManager,
        ]

        // Function to handle all tasks and ensure they run sequentially
        async function runTasks() {
            for ( let task of tasks ) {
                await prevErr( await task ); // Ensure each task finishes before continuing
            }
        }

        // Run all tasks and wait until completion
        await runTasks();

        // After this finishes, remove the loading screen.
        elementsManager.loader.fadeOut( 300 );

        // Finally add some of the pasaz that the user can see.
        animatePopupText();
    } )

} ) ( jQuery, window, document );