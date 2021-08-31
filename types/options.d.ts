import { Smallify, PluginDoneCallback, PluginOptions, Route } from 'smallify'

export class MarkdownOptions extends PluginOptions {
  dir?: string
  title?: string
  customWriter?: (filePath: string, route: Route) => void
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
