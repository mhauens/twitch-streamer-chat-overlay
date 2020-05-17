window.addEventListener("load", function () {
    var pageLoadedName;
    console.log("TWITCH SCRIPT: Page Loaded.");

    setTimeout(function () {
        //due to DOM manipulations from twitch, this timeout is needed
        pageLoadedName = $("#root").attr("data-a-page-loaded-name");
        console.log("TWITCH SCRIPT: Looking for Pagename...");
        console.log("TWITCH SCRIPT: Found Pagename: ", pageLoadedName);

        if (
            pageLoadedName === "ChannelPage" ||
            pageLoadedName === "ChannelWatchPage"
        ) {
            if (confirm("Activate chat-overlay?")) {
                console.log("TWITCH SCRIPT: Confirmed to run script.");
                $("body").find(".persistent-player").empty();
                $("body").find("[data-a-target='video-player']").empty();

                $("body")
                    .find(
                        ".channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated"
                    )
                    .addClass("hide");
                $("body")
                    .find(
                        ".side-nav.side-nav--collapsed.tw-c-background-alt.tw-flex-shrink-0.tw-full-height.tw-z-abov"
                    )
                    .addClass("hide");
                $("body")
                    .find(
                        ".tw-flex.tw-flex-column.tw-flex-grow-1.tw-full-height.tw-full-width.tw-overflow-hidden.tw-relative.tw-z-default.twilight-main"
                    )
                    .addClass("hide");
                $(".chat-shell.chat-shell__expanded.tw-full-height").addClass(
                    "chat-shell--modified"
                );
                $(".channel-root__right-column").addClass(
                    "channel-root__right-column--modified"
                );

                $("body").find('[data-a-target="top-nav-container"]').remove();
                $("body")
                    .find('[data-a-target="side-nav-bar-collapsed"]')
                    .remove();

                $("#root").before(
                    '<highlight-chat></highlight-chat><button class="btn-clear">CLEAR</button>'
                );

                $("body")
                    .unbind("click")
                    .on(
                        "click",
                        "[data-a-target='chat-line-message']",
                        function () {
                            $(".hl-c-cont").remove(); /* remove old insert */

                            var chatName = $(this)
                                .find("[data-a-target='chat-message-username']")
                                .text();
                            chatName = chatName.replace(/ .*/, "");

                            var chatBadgeList = $(this).find(
                                "[data-a-target='chat-badge']"
                            );

                            var chatBadges = "";

                            var getChatBadges = () => {
                                chatBadgeList.each((i) => {
                                    chatBadges = chatBadges.concat(
                                        chatBadgeList[i].innerHTML
                                    );
                                });
                            };

                            getChatBadges();

                            $(this).addClass("msg-shown");

                            var chatMessageDomElem = $(this).clone();

                            donationLogo = chatMessageDomElem
                                .find('img[alt~="cheer"]')
                                .attr("src");

                            console.log(
                                "TWITCH SCRIPT: donationLogo ",
                                donationLogo
                            );

                            chatMessageDomElem
                                .find('img[alt~="cheer"]')
                                .remove();

                            var chatDonationAmount = chatMessageDomElem
                                .find(".chat-line__message--cheer-amount")
                                .html();

                            chatMessageDomElem
                                .find(".chat-line__message--cheer-amount")
                                .remove();

                            var donationBadge = "";
                            var donationHeader = "";
                            if (chatDonationAmount) {
                                donationBadge =
                                    "<div class='donation-badge'><img src='" +
                                    donationLogo +
                                    "' />" +
                                    chatDonationAmount +
                                    "</div>";
                                donationHeader =
                                    "<div class='donation-header'></div>";
                            }

                            chatMessageDomElem
                                .find("[data-a-target='chat-message-username']")
                                .remove();
                            chatMessageDomElem
                                .find(".chat-line__username")
                                .remove();
                            chatMessageDomElem
                                .find("[data-a-target='chat-badge']")
                                .empty();

                            searchString = '<span aria-hidden="true">: </span>';

                            var msgStartAfter = chatMessageDomElem
                                .html()
                                .indexOf(searchString);

                            var chatMessage = chatMessageDomElem.html();

                            chatMessage = chatMessage.substring(
                                msgStartAfter + searchString.length,
                                chatMessage.length
                            );

                            $("highlight-chat")
                                .append(
                                    "<div class='hl-c-cont fadeout'><div class='hl-name'>" +
                                        chatBadges +
                                        chatName +
                                        "</div>" +
                                        "<div class='donation-wrapper'>" +
                                        donationBadge +
                                        "<div class='hl-message'>" +
                                        donationHeader +
                                        chatMessage +
                                        "</div>" +
                                        "</div>" +
                                        "</div>"
                                )
                                .delay(20)
                                .queue(function (next) {
                                    $(".hl-c-cont").removeClass("fadeout");
                                    next();
                                });
                        }
                    );

                $("body").on("click", ".btn-clear", function () {
                    $(".hl-c-cont")
                        .addClass("fadeout")
                        .delay(10)
                        .queue(function () {
                            $(".hl-c-cont").remove().dequeue();
                        });
                });

                function getPosition(string, subString, index) {
                    return string.split(subString, index).join(subString)
                        .length;
                }
            }
        } else {
            console.error(
                "TWITCH SCRIPT: Pagename is not in the supported list."
            );
        }
    }, 1000);
});
