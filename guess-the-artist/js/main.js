$("document").ready(function () {
    var arrMusic =
            [
                "Lil Peep - Save That Shit",
                "Linkin Park - Figure 09",
                "Maroon 5 - My Lucky Strike",
                "Mattafix - Skake Your Limbs",
                "OutKast - Ms. Jackson",
                "RHCP - Californication",
                "Russ - Me You",
                "Sum 41 - Blood In My Eyes",
                "Pain - Follow Me",
                "XXXTENTACION - SAD!",
                "2Pac - Better Dayz",
                "Arctic Monkeys - Brick By Brick",
                "AwolNation - Sail",
                "Bruno Mars - That's What I Like",
                "Childish Gambino - Redbone",
                "DMX - Dog is out",
                "Drake - God's Plan",
                "Eminem - Rap God",
                "Eurythmics - Sweet Dreams",
                "Foster The People - Dont Stop",
                "50 Cent - Wanksta",
                "Arctic Monkeys - Old Yellow Bricks",
                "Ed Sheeran - Sing",
                "Eminem - Superman",
                "Future - Mask Off",
                "Gnarls Barkley - Crazy",
                "Gorillaz - Blablabla",
                "Green Day - American Idiot",
                "Hollywood Undead - California",
                "Imagine Dragons - Believer",
                "Jay-Z - Big Pimpin'Papercut",
                "John Newman - Love Me Again",
                "Kanye West - Gold Digger",
                "Kendrick Lamar - DNA.",
                "Kiss - I Was Made For Lovin' You",
                "Limp Bizkit - Rollin'",
                "Marlin Manson - Lamb Of God",
                "Papa Roach - Help",
                "Metallica - Die, Die My Darling",
                "Nirvana - Sliver"
            ],
        selectedMusic = [],
        answers = $(".answer li"),
        score = 0,
        guessed = 0,
        audio = new Audio(),
        currentNumber = 0,
        start = $("#start"),
        pic = new Image(),
        recordSpan = $(".record span"),
        currentMusic, interval, timeout, countMusic;

    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    if(getCookie("score")) recordSpan.text(getCookie("score"));
    
    pic.src="img/loader.gif";

    start.click(function () {  // Нажатие на кнопку старт
        var next = $("#next"),
            response = $(".response"),
            guessedSpan = $(".guessed span"),
            timeSpan = $(".time span"),
            scoreSpan = $(".score span");

        if(currentNumber > 10) {  // Рестарт игры
            score = 0; guessed = 0; currentNumber = 0;
            scoreSpan.text(score);
            guessedSpan.eq(0).text(guessed);
        }

        function fRand(arr) {
            return Math.floor(Math.random() * arr.length);
        }

        start.css("display", "none"); // Кнопка старт исчезает
        start.val("Начать игру заного");
        next.val("Следующий трек");
        next.css("display", "inline-block");

        for(var i = 0; i < 10; i++) {  // Заполнение 10 треков для отгадывания
            var rand = arrMusic[fRand(arrMusic)];
            while($.inArray(rand, selectedMusic) !== -1) rand = arrMusic[fRand(arrMusic)];
            selectedMusic.push(rand);
        }

        countMusic = selectedMusic.length;  // Количество выбраных треков
        guessedSpan.eq(1).text(countMusic);

        next.click(function () {
            var rand = fRand(selectedMusic),
                count = 20, // Интервал секундамера
                countAnswers = [0, 1, 2],
                fakeAnswer = [];

            function clear() {  // Функция для сброса интервала, таймера и обработчика на ответы
                answers.off("click");
                if(interval) clearInterval(interval);
                if(timeout) clearTimeout(timeout);
            }

            clear();

            ++currentNumber;
            if(currentNumber > 10) {  // Конец игры, если номер песни больше 10
                response.text("Конец игры! Ваш счет: " + score).css({"visibility": "visible", "color": "black"});
                next.css("display", "none");
                start.css("display", "inline-block");
                audio.pause();
                next.off("click");
                if(+recordSpan.text() < score) {
                    document.cookie = "score=" + score + "; max-age=2592000";
                    recordSpan.text(getCookie("score"));
                }
                return;
            }
            if(currentNumber === 10) next.val("Закончить игру");
            $(".number span").text(currentNumber);

            response.css("visibility", "hidden");
            timeSpan.text(20);

            currentMusic = selectedMusic[rand];
            selectedMusic.splice(rand, 1);

            for(var i = 0; i < 2; i++) {  // Заполнение массива с фейковыми треками
                var countFake = fRand(arrMusic);
                while(arrMusic[countFake] === currentMusic || arrMusic[countFake] === fakeAnswer[0]) countFake = fRand(arrMusic);
                fakeAnswer.push(arrMusic[countFake]);
            }
            for(i = 0; i < 2; i++) {  // В рандомные два li вписываем фейковые треки
                rand = fRand(countAnswers);
                answers.eq(countAnswers[rand]).text(fakeAnswer[i]);
                countAnswers.splice(rand, 1);
            }
            rand = countAnswers.shift();  // Вписываем в оставшийся li правильный трек
            answers.eq(rand).text(currentMusic);

            audio.src = "music/" + currentMusic + "-Trimed-0.mp3";
            audio.autoplay = true;
            audio.volume = 0.2;
            audio.onloadstart = function() {
                response.html("Подождите, идет загрузка трека <img src='" + pic.src + "'>").css({"visibility": "visible", "color": "black"});
            };
            audio.oncanplaythrough = function() {
                response.css("visibility", "hidden");
                interval = setInterval(function () {  // Установка интервала для счетчика времени
                    count--;
                    timeSpan.text(count);
                }, 1000);

                timeout = setTimeout(function () {  // Установка таймера для отсановки проигрывания трека
                    audio.pause();
                    clear();
                    timeSpan.text(0);
                    response.text("Истекло время. Это был: " + currentMusic).css({"visibility": "visible", "color": "red"});
                }, 20000);

                answers.on("click", function (e) {  // Установка обработчика событий для ответов
                    clear();
                    audio.pause();
                    if(e.target.innerHTML === currentMusic) {  // Если ответ выбран правильно
                        guessed += 1;
                        score += +timeSpan.text();
                        scoreSpan.text(score);
                        response.text("Совершенно верно! Это трек: " + currentMusic).css({"visibility": "visible", "color": "green"});
                    }
                    else {  // Если ответ выбран неверно
                        response.text("Не угадали. Это был: " + currentMusic).css({"visibility": "visible", "color": "red"});
                    }
                    guessedSpan.eq(0).text(guessed);
                })
            };
        });

        next.trigger("click");
    });
});