![Coward](img/logo.png)

Coward is a Deno module for easy interaction with the [Discord API](https://discordapp.com/developers/docs/intro "Discord API")

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat)](#contributors-)
[![license](https://img.shields.io/github/license/fox-cat/coward)](LICENSE)
[![maintainability](https://img.shields.io/codeclimate/maintainability-percentage/fox-cat/coward)](https://codeclimate.com/github/fox-cat/coward/maintainability)
[![deno documentation](https://img.shields.io/badge/deno-documentation-blue?style=flat)](https://doc.deno.land/https/deno.land/x/coward/mod.ts)
[![chat](https://img.shields.io/discord/699014519745413181?style=flat)](https://discord.gg/9u9Hkn7)

## Usage

You must be using [Deno v1.0.2](https://github.com/denoland/deno/releases/tag/v1.0.2) or higher.
```typescript
import { Client } from "https://deno.land/x/coward@v0.3.2/mod.ts";
```
Please don't use this in anything important yet. It is barely functional, and as such is not production ready.

## Ping-Pong Example

```typescript
import { Client } from "https://deno.land/x/coward@v0.3.2/mod.ts";

let client = new Client("TOKEN");

client.events.ready.on(() => {console.log("READY!")});

client.events.messageCreate.on(async ({message}) => {
  if(message.content == "!ping") {
    await message.channel.createMessage("Pong!");
  }
})

client.connect()
```

## License

Please refer to [LICENSE](LICENSE).

## Contributing

Any contributions to Coward are accepted and encouraged.
This can range from submitting bug reports, requesting features, improving documentation, or writing code.
Please refer to [CONTRIBUTING](CONTRIBUTING.md).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Joralmo"><img src="https://avatars0.githubusercontent.com/u/19753876?v=4" width="100px;" alt=""/><br /><sub><b>Joralmo</b></sub></a><br /><a href="https://github.com/fox-cat/coward/commits?author=Joralmo" title="Code">💻</a> <a href="https://github.com/fox-cat/coward/issues?q=author%3AJoralmo" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/userterminal"><img src="https://avatars3.githubusercontent.com/u/55012346?v=4" width="100px;" alt=""/><br /><sub><b>Exists</b></sub></a><br /><a href="https://github.com/fox-cat/coward/commits?author=userterminal" title="Code">💻</a></td>
    <td align="center"><a href="http://mikuroxina.github.io/portfolio"><img src="https://avatars2.githubusercontent.com/u/10331164?v=4" width="100px;" alt=""/><br /><sub><b>Mikuro Xina</b></sub></a><br /><a href="https://github.com/fox-cat/coward/commits?author=MikuroXina" title="Code">💻</a></td>
    <td align="center"><a href="https://ahowe.dev/"><img src="https://avatars2.githubusercontent.com/u/16884313?v=4" width="100px;" alt=""/><br /><sub><b>unlimitedcoder2</b></sub></a><br /><a href="https://github.com/fox-cat/coward/commits?author=unlimitedcoder2" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
