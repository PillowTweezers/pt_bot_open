<div align="center">
<img src="https://cdn.pixabay.com/photo/2016/08/08/10/49/watercolour-1578076_960_720.jpg" alt="" width="700" />

# The PillowTweezers WA Bot

</div>

> Welcome to our humble and nice little Whatsapp bot!
It was written in mind of the users and participants of the group and tries to comply as much as possible with WhatsApp bs anti-bot/anti-fun rules.

# Features

| Covid-19 | Availability |
| :------: | :----------: |
| Covid statistics | ✔ |
| Covid statistics on a settlement| ✔ ️|
| Covid statistics on a country| ✔ ️|

| Sticker Maker | Availability |
| :-----------: | :----------: |
| Image to sticker | ✔ ️|
| Video to sticker | ✔ ️|
| GIF to sticker | ✔ ️|
| Message to sticker | Soon ️|

| Admin Tools | Availability |
| :-----------: | :----------: |
| Tag-All | ✔ ️|

| Games | Availability |
| :---: | :----------: |
| Trivia | ✔ |
| Block user | ✔ |
| Unblock user | ✔ |


| Fun Commands | Availability |
| :----------: | :----------: |
| Cat pictures | ✔ |
| Dog pictures | ✔ |
| Duck pictures | ✔ |
| Fox pictures | ✔ |
| Lizard pictures | ✔ |
| Shiba pictures | ✔ |
| Pig pictures | ✔ |
| Random Number | ✔ |
| Sentiment processing<br>of message | ✔ | 
| Generate random name<br>from Israel's records | ✔ | 
| Gimatria equivalents<br>finder | ✔ | 
| Joke generator | ✔ |
| Love calculator | ✔ |
| Tip generator | ✔ |
| TV schedule | ✔ |
| Scouts job generator | ✔ |

| Other Commands | Availability |
| :------------: | :----------: |
| Help menu | ✔ |
| Failsafe command | ✔ |
| Alarm command | ✔ |
| Whatsapp surveys | ✔ |
| Translate command | ✔ |
| Wikipedia article extractor | ✔ |
| Dictionary definition command | ✔ |

| Utility Commands | Availability |
| :--------------: | :----------: |
| Weather report for<br>settlement | ✔ |
| Recording to text | ✔ |
| Text to recording | ✔ |
| Breaking news | ✔ |

| Image commands | Availability |
| :-----------: | :----------: |
| Find similarity<br>between faces | ✔ |
| Face detection | ✔ |
| Colorize black&white<br>pictures | ✔ |

# Installation and Usage

### Dependencies:

- Node.js (Only latest is tested)
- Python 3.7 (May work with later versions too)
- Tensorflow (Only latest is tested, CUDA included)

### Installation:

Clone this project

```bash
> git clone https://github.com/PillowTweezers/pt_bot_open.git
> cd pt_bot
```

Install dependencies

```bash
> npm i
```

<strong>WINDOWS ONLY</strong>

If tensorflow blocks the bot from running, this command may fix it:

```bat
copy "node_modules\@tensorflow\tfjs-node\deps\lib\tensorflow.dll" "node_modules\@tensorflow\tfjs-node\lib\napi-v5\"
```

### Special commands preparation:
#### WhoIs command:
1. Install "me" app on an android device.
2. Install burp on your computer.
3. Use the proxy option and extract from the http requests this tokens: Authorization-token and pwd-token.
4. Put them in the config

#### Colorize command:
Install the models and put them in ```bin/pythonScripts/models```.

#### Api commands:
Just create users in rapid-api and all the sites in the ```config/apiKeys.json```<br>
and subscribe to these APIes (all of them are free).
1. http://www.voicerss.org
2. https://openweathermap.org
3. https://rapidapi.com/spamakashrajtech/api/corona-virus-world-and-india-data
4. https://rapidapi.com/fyhao/api/text-sentiment-analysis-method
5. https://rapidapi.com/nijikokun/api/baby-pig-pictures



### Usage

Start with npm

```bash
> npm start
```

Or with node

```bash
> node lib/bot.js
```

# Thanks

I want to thank my Mama and Pa.
