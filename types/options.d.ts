import { Smallify, PluginDoneCallback, PluginOptions } from 'smallify'

export class MarkdownOptions extends PluginOptions {
  dir?: string
  title?: string
}

export type SmallifyMarkdown = (
  smallify: Smallify,
  opts: MarkdownOptions,
  done: PluginDoneCallback
) => Promise<void>

export interface MarkdownRouteOptions {
  name?: string
  description?: string
  desc?: string
}
