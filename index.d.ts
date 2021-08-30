import { Smallify } from 'smallify'
import {
  SmallifyMarkdown,
  MarkdownOptions,
  MarkdownRouteOptions
} from './types/options'

declare const markdown: SmallifyMarkdown

export = markdown
export { MarkdownRouteOptions }

declare module 'smallify' {
  interface SmallifyPlugin {
    (plugin: SmallifyMarkdown, opts: MarkdownOptions): Smallify
  }

  interface Route {
    markdown?: MarkdownRouteOptions
    md?: MarkdownRouteOptions
  }
}
