import { Controller } from '@hotwired/stimulus'
import Sortable from 'sortablejs'
import { patch } from '@rails/request.js'

export default class extends Controller {
  animationValue: number
  resourceNameValue: string
  paramNameValue: string
  responseKindValue: string
  sortable: Sortable
  handleValue: string
  draggableValue: string
  // @ts-ignore
  element: HTMLElement

  static values = {
    resourceName: String,
    paramName: {
      type: String,
      default: 'position'
    },
    responseKind: {
      type: String,
      default: 'html'
    },
    animation: Number,
    handle: String,
    draggable: String
  }

  initialize () {
    this.onUpdate = this.onUpdate.bind(this)
  }

  connect () {
    this.sortable = new Sortable(this.element, {
      ...this.defaultOptions,
      ...this.options
    })
  }

  disconnect () {
    this.sortable.destroy()
    this.sortable = undefined
  }

  async onUpdate ({ item, newIndex }) {
    if (!item.dataset.sortableUpdateUrl) return

    const param = this.resourceNameValue ? `${this.resourceNameValue}[${this.paramNameValue}]` : this.paramNameValue

    const data = new FormData()
    data.append(param, newIndex + 1)

    await patch(item.dataset.sortableUpdateUrl, { body: data, responseKind: this.responseKindValue })
  }

  get options (): Sortable.Options {
    return {
      animation: this.animationValue || this.defaultOptions.animation || 150,
      handle: this.handleValue || this.defaultOptions.handle || undefined,
      onUpdate: this.onUpdate,
      draggable: this.draggableValue || this.defaultOptions.draggable || /^[uo]l$/i.test(this.element.nodeName) ? '>li' : '>*'
    }
  }

  get defaultOptions (): Sortable.Options {
    return {}
  }
}
