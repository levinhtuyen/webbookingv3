import { isWhitePath } from '../util/gateway-handler';

// NOTE - from https://antoinevastel.com/bot/2020/05/10/express-middleware-bot.html

// middleware/isBot.js

// Map bot name to regular expression used to detect them based
// on their user-agent
const knownBotsToPattern = new Map([
  ["Headless Chrome", /HeadlessChrome/],
  ["Wget", /[wW]get/],
  ["Python urllib", /Python\-urllib/],
  ["PHP crawl", /phpcrawl/],
  ["PhantomJS", /PhantomJS/],
  ["G2JBot", /G2JBot/],
  // https://user-agents.net/string/mozilla-4-0-compatible-msie-8-0-windows-nt-6-1-wow64-trident-4-0-gtb7-5-slcc2-net-clr-2-0-50727-net-clr-3-5-30729-net-clr-3-0-30729-media-center-pc-6-0-infopath-3-zune-4-7
  ["Zune", /Trident/],
  ["SitemapGenerator", /XML\-Sitemaps/],
  ["PagePeeker", /PagePeeker/],
  ["GTmetrix", /GTmetrix/],
  ["Screaming Frog SEO Spider", /'Screaming Frog SEO Spider'/]
]);

let tmpBotName = null;

// Detect if an incoming request belongs to a bot using its user agent
function isKnownBotUserAgent(userAgent) {
  console.log(userAgent);
  for (const [knownBot, pattern] of knownBotsToPattern.entries()) {
    if (!userAgent) {
      return {
        isBot: true,
        // In case the request comes from a bot,
        // we also returns the name of the bot
        nameBot: "unknow",
      };
    } else if (userAgent.match(pattern)) {
      if(knownBot.trim() !== 'Headless Chrome') {
        tmpBotName = knownBot.trim();
      }

      return {
        isBot: true,
        // In case the request comes from a bot,
        // we also returns the name of the bot
        nameBot: (tmpBotName || knownBot.trim()),
      };
    }
  }

  tmpBotName = null;

  return {
    isBot: false,
  };
}

export default function isBot(req, res, next) {
  if(!isWhitePath(req.customizeInfo.url)) {
    req.botInfo = {
      isBot: false,
    };

    next();
    return;
  }

  // We enrich the incoming request object (req)
  // with information regarding bot detection
  req.botInfo = isKnownBotUserAgent(req.header("User-Agent"));

  next();
}
