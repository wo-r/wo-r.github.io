<!--
HEAD::[The future is bright 😄]
SUBHEAD::[I was thinking about it, and I'm kinda in a really good spot right now with my projects. Like literally my school wants me to make things for th...]
DATE::[May 16th, 2024]
-->
# Firstly
I must say, this is significantly better than the original articles page. It's cleaner and runs more efficiently. I'm glad I took the effort to redo this raggedy old code from an earlier version of myself that was poorly coded.

# The Plan
This part of the website contains things that I thought should be read by others, for any reason. One of the most important ideas of this section is that people can find things about coding problems that I had to face as a learning programmer. It also contains anything that I just think of.

# Keep going
```js
(async function () {
  "use strict";

  console.log("hello world!");
})();
```

I feel like we all start somewhere we don't like, and have to correct it. I certaintly feel like that when I code. I feel like I am doing the right thing, then it suddenly hits me in the face with the "ERRRR, that ain't right". It's just annoying. Yet I still code and advance my development in it. Why? **Just do it**, Like actually. It can't get better if you don't power through it. Which is why it feels like hell sometimes, it just means you gotta keep trying at it. Eventually you will get it. 

Take this for example:
![Old Gradpass](https://github.com/wo-r/wo-r.github.io/assets/78428114/4da9623b-1cbb-4e42-a75a-61adefa6774a)
*Taken from branch [**17d24b4**](https://github.com/gradpass/gradpass.github.io/tree/17d24b4075b02d07a6df57be118e5f999907228a)*

This is an older version of **Gradpass*—a web app to check grades, agendas and more—The file format, and the code itself was all badly organized, it relied on the complete idea that the whole thing would run off one single file, which in it's self is not bad if the file wasn't 4000 lines long. So for the sake of cleanliness and efficiency I decided to redo the whole project. 

Leading to this:
![New Gradpass](https://github.com/wo-r/wo-r.github.io/assets/78428114/dfbcbfe8-9374-4f52-82f4-8f700924685a)
*Taken from branch [**1953e47**](https://github.com/gradpass/gradpass.github.io/tree/1953e471acba2501e2f749829f665d1568d610be)*

Note the amount of commits from then to now. That much work to make such a professional looking product just because of the choice to redo the work. Was it worth it? **Yes**, but the time and effort was such a task, yet I still persisted in it. If I can take it, I believe you could too. 

# Example of refined code
Throughout the years of coding the **Gradpass** project, I have learned so much more about jquery and programming in general. One of the biggest feats was keeping the user logged in all the time. Apperently Echo released a new api feature in login to have an infinite login session, although this code below was done before that was added.

```js
$(window).on("load", function () {
    $("#pfp").attr("src", helper.get("pfp").url);
    agilix.extendSession();
    let expirationMinutes = agilix.get("AUTH");
    let expirationTime = Date.now() + expirationMinutes * 60 * 1000;
    let countdownInterval = setInterval(function () {
        // most likely that the user logged out
        if (expirationMinutes == null)
            return;
        
        let currentTime = Date.now();
        let timeLeft = expirationTime - currentTime;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            agilix.extendSession(); 
        }
    }, 1000);
})
```

Here is the new version of the this:
```js
// Get login api
let login3 = await $.ajax({
    url: hlp.api("/cmd"),
    method: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: hlp.stringify({"request": {
        cmd: "login3",
        expireseconds: "-999",
        username: `${district}/${hlp.get("saved") == undefined ? $("#username").val() : hlp.get("saved").username}`,
        password: $("#password").val()
    }}),
});
```

The json object `expireseconds` is what they added, it allows negative time, which forces the login session to last indefinitly.

Don't think this happened over night. It took almost 4 months to figure this out. I wish I was joking, but I'm not. :cry:

So, when you program, know one thing. Persistence is key. Never think that because you couldn't get it the first time, it will never be able to happen. Coding is a long run, a run that you must endure and accept. If you can't do that, then maybe coding isn't for you.

# Hope all is well!
Thanks for reading, I hope you learned something from this!




