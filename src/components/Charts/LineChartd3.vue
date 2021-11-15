<template>
  <div ref="chartEl" class="chart-wrapper">
    <div class="tooltip" ref="tooltipRef">
      <div class="tooltip__title">title</div>
      <div class="tooltip__body">
        <span class="tooltip__sub"> Transactions: </span>
        <div class="tooltip__text">text</div>
      </div>
      <span class="tooltip__arrow"></span>
    </div>
  </div>
</template>

<style lang="scss">
.chart-wrapper {
  width: 100%;
  height: 45.9rem;
}

.domain,
.tick line {
  color: transparent;
}
.tick text {
  font-size: 1.2rem;
}
.y.axis-grid .tick line {
  color: #cce4ff;
}
.y.axis-grid > .domain {
  display: none;
}
.tooltip {
  position: absolute;
  z-index: 2;
  background: rgb(5, 63, 125);
  border-radius: 3px;
  color: white;
  opacity: 0;
  pointer-events: none;
  transition: all 0.1s ease 0s;
  padding: 6px;
  &__sub {
    display: inline-block;
    color: rgba(255, 255, 255, 0.6);
    padding-right: 8px;
  }
  &__title {
    font-size: 1.6rem;
    font-weight: 700;
  }
  &__body {
    display: flex;
    justify-content: space-between;
  }
  &__arrow {
    position: absolute;
    background: transparent;
    width: 10px;
    height: 10px;
    border-top: 10px solid transparent;
    border-right: 10px solid rgb(5, 63, 125);
    border-bottom: 10px solid transparent;
    top: calc(100% - 5px);
    left: calc(50% - 5px);
    transform: rotate(270deg);
  }
}
</style>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { marginType } from '@/helpers/Types'
import {
  select,
  scaleLinear,
  scaleTime,
  timeFormat,
  curveMonotoneX,
  line,
  axisLeft,
  axisBottom,
  max,
} from 'd3'
import { convertToDayMonth } from '@/helpers/dates'

export default defineComponent({
  name: 'LineChart_D3',
  props: {
    chart: {
      type: Array as <T>() => Array<T>,
      required: true,
    },
    margin: {
      type: Object as () => marginType,
      default: () => ({
        top: 25,
        right: 25,
        bottom: 25,
        left: 25,
      }),
    },
    duration: {
      type: Number,
      default: () => 250,
    },
  },
  setup: function (props) {
    const chartEl = ref<any | null>(null)
    const tooltipRef = ref<HTMLDivElement | null>(null)
    const isFirstRender = ref<boolean>(true)
    const chart = ref()
    const data = ref()

    const height = ref<number>()
    const width = ref<number>()

    const _x = ref()
    const _y = ref()
    const xAxis = ref()
    const yAxisGrid = ref()
    const yAxis = ref()
    const _line = ref()

    const _timeFormat = timeFormat('%b %e')

    function _normalizedData() {
      return props.chart.map((item: any) => ({
        date: item.date,
        value: item.value,
      }))
    }

    function _clear() {
      select(chartEl.value).select('svg').remove()
    }

    function _init() {
      if (!chartEl.value) throw new ReferenceError(`chartEl ref error`)

      isFirstRender.value = true
      _clear()

      data.value = _normalizedData()
      height.value =
        chartEl?.value?.getBoundingClientRect().height -
        props.margin.top -
        props.margin.bottom
      width.value =
        chartEl?.value?.getBoundingClientRect().width -
        props.margin.left -
        props.margin.right

      chart.value = select(chartEl.value)
        .append('svg')
        .attr(
          'viewBox',
          `0, 0, ${width.value + props.margin.left + props.margin.right}, ${
            height.value + props.margin.top + props.margin.bottom
          }`
        )
        .style('-webkit-tap-highlight-color', 'transparent')
        .style('overflow', 'visible')
        .attr('class', 'chart-svg')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('width', width.value + props.margin.left + props.margin.right)
        .attr('height', height.value + props.margin.top + props.margin.bottom)
        .attr('preserveAspectRatio', 'xMinYMin')
        .append('svg:g')
        .attr(
          'transform',
          `translate(${props.margin.left},${props.margin.top})`
        )

      _x.value = scaleTime().range([
        props.margin.left,
        (width.value as number) - props.margin.right,
      ])

      _y.value = scaleLinear().range([
        (height.value as number) - (props.margin.bottom + props.margin.top),
        props.margin.top,
      ])

      xAxis.value = axisBottom(_x.value)
        .tickFormat((d: any) => {
          return _timeFormat(d)
        })
        .ticks(data.value.length)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      yAxis.value = axisLeft(_y.value)

      yAxisGrid.value = axisLeft(_y.value)
        .tickSize(-width.value)
        .tickFormat(() => '')
        .ticks(10)
      _update()
    }

    function _update() {
      if (!isFirstRender.value) {
        data.value = _normalizedData()
        xAxis.value.ticks(data.value.length)
      }
      _line.value = line()
        .curve(curveMonotoneX)
        .defined((d: any) => !isNaN(d.value))
        .x((d: any) => _x.value(d.date))
        .y((d: any) => _y.value(d.value))

      _x.value.domain([
        data.value[0].date,
        data.value[data.value.length - 1].date,
      ])
      _y.value.domain([0, max(data.value, (d: any) => d.value)])

      if (isFirstRender.value) {
        const y_grid = chart.value
          .append('svg:g')
          .attr('class', 'y axis-grid')
          .call(yAxisGrid.value)

        y_grid.attr('transform', `translate(${props.margin.left},0)`)

        const axis_x = chart.value
          .append('svg:g')
          .attr('class', 'axis-x')
          .call(xAxis.value)

        axis_x.attr(
          'transform',
          `translate(0,${(height.value as number) - props.margin.bottom})`
        )

        const axis_y = chart.value
          .append('svg:g')
          .attr('class', 'axis-y')
          .call(yAxis.value)

        axis_y.attr('transform', `translate(${props.margin.left},0)`)

        const path = chart.value
          .append('path')
          .attr('class', 'line')
          .datum(data.value)
          .attr('d', _line.value)

        path
          .attr('fill', 'none')
          .attr('stroke', '#66B0FF')
          .attr('stroke-width', 1.5)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .transition()
          .duration(props.duration)
      } else {
        let y_grid = chart.value.selectAll('.y.axis-grid').call(yAxisGrid.value)
        y_grid.transition().duration(props.duration)

        let path = chart.value.selectAll('.line').datum(data.value)
        path = path.enter().append('path').attr('class', '.line').merge(path)
        path.transition().duration(props.duration).attr('d', _line.value)

        let axis_y = chart.value.selectAll('.axis-y').call(yAxis.value)
        axis_y = axis_y.enter().merge(axis_y)
        axis_y.transition().duration(props.duration)
        let axis_x = chart.value.selectAll('.axis-x').call(xAxis.value)
        axis_x = axis_x.enter().merge(axis_x)
        axis_x.transition().duration(props.duration)
      }

      const dots = chart.value.selectAll('circle').data(data.value)
      dots
        .enter()
        .append('circle')
        .style('cursor', 'pointer')
        .attr('r', 3)
        .merge(dots)
        .attr('cx', (d: any) => _x.value(d.date))
        .attr('cy', (d: any) => _y.value(d.value))
        .attr('fill', '#66B0FF')
        .on('mouseover', (event, d): void => {
          tooltip
            .style('opacity', 1)
            .style(
              'left',
              event.pageX - (tooltipRef.value?.offsetWidth as number) / 2 + 'px'
            )
            .style(
              'top',
              event.pageY -
                (tooltipRef.value?.offsetWidth as number) / 2 -
                15 +
                'px'
            )

          tooltip.select('.tooltip__title').text(convertToDayMonth(d.date))
          tooltip.select('.tooltip__text').text(d.value)
        })
        .on('mouseleave', (): void => {
          tooltip.style('opacity', 0)
        })

      const tooltip = select(tooltipRef.value)
      tooltip.transition().duration(props.duration)

      isFirstRender.value = false
    }

    onMounted(() => {
      isFirstRender.value ? _init() : _update()
    })

    watch(props.chart, () => {
      return isFirstRender.value ? _init() : _update()
    })

    return { chartEl, tooltipRef }
  },
})
</script>
