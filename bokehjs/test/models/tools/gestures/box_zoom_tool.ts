import {expect} from "chai"

import {Document} from "document"
import {Tool} from "models/tools/tool"
import {BoxZoomTool, BoxZoomToolView} from "models/tools/gestures/box_zoom_tool"
import {Range1d} from "models/ranges/range1d"
import {Plot, PlotView} from "models/plots/plot"

describe("BoxZoomTool", () => {

  describe("Model", () => {

    it("should create proper tooltip", () => {
      const tool = new BoxZoomTool()
      expect(tool.tooltip).to.be.equal('Box Zoom')

      const x_tool = new BoxZoomTool({dimensions: 'width'})
      expect(x_tool.tooltip).to.be.equal('Box Zoom (x-axis)')

      const y_tool = new BoxZoomTool({dimensions: 'height'})
      expect(y_tool.tooltip).to.be.equal('Box Zoom (y-axis)')
    })
  })

  describe("View", () => {

    function mkplot(tool: Tool): PlotView {
      const plot = new Plot({
        x_range: new Range1d({start: -1, end: 1}),
        y_range: new Range1d({start: -1, end: 1}),
      })
      plot.add_tools(tool)
      const document = new Document()
      document.add_root(plot)
      return new plot.default_view({model: plot, parent: null}).build()
    }

    it("should zoom in both ranges", () => {
      const box_zoom = new BoxZoomTool()
      const plot_view = mkplot(box_zoom)

      const box_zoom_view = plot_view.tool_views[box_zoom.id] as BoxZoomToolView

      // perform the tool action
      const zoom_event0 = {type: "pan" as "pan", sx: 200, sy: 100, deltaX: 0, deltaY: 0, scale: 1, shiftKey: false}
      box_zoom_view._pan_start(zoom_event0)

      const zoom_event1 = {type: "pan" as "pan", sx: 400, sy: 500, deltaX: 0, deltaY: 0, scale: 1, shiftKey: false}
      box_zoom_view._pan_end(zoom_event1)

      const hr = plot_view.frame.x_ranges['default']
      expect(hr.start).to.be.closeTo(-0.31, 0.01)
      expect(hr.end).to.be.closeTo(0.4, 0.01)

      const vr = plot_view.frame.y_ranges['default']
      expect(vr.start).to.be.closeTo(-0.678, 0.01)
      expect(vr.end).to.be.closeTo(0.678, 0.01)
    })

    it("should zoom in with match_aspect", () => {
      const box_zoom = new BoxZoomTool({match_aspect: true})
      const plot_view = mkplot(box_zoom)

      const box_zoom_view = plot_view.tool_views[box_zoom.id] as BoxZoomToolView

      // perform the tool action
      const zoom_event0 = {type: "pan" as "pan", sx: 200, sy: 200, deltaX: 0, deltaY: 0, scale: 1, shiftKey: false}
      box_zoom_view._pan_start(zoom_event0)

      const zoom_event1 = {type: "pan" as "pan", sx: 400, sy: 300, deltaX: 0, deltaY: 0, scale: 1, shiftKey: false}
      box_zoom_view._pan_end(zoom_event1)

      const hr = plot_view.frame.x_ranges['default']
      expect(hr.start).to.be.closeTo(-0.31, 0.01)
      expect(hr.end).to.be.closeTo(0.4, 0.01)

      const vr = plot_view.frame.y_ranges['default']
      expect(vr.start).to.be.closeTo(-0.37, 0.01)
      expect(vr.end).to.be.closeTo(0.34, 0.01)
    })
  })
})
