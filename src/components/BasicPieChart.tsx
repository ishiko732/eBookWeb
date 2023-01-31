import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  HorizontalAlignmentType,
  VerticalAlignmentType,
} from "recharts/types/component/DefaultLegendContent";

export interface pieData {
  name: string;
  value: number;
  color?: string;
}

export const BasicPieChart = (props: {
  data: pieData[];
  width: number;
  height: number;
  cx: number;
  cy: number;
  outerRadius?: number;
  isLabel?: boolean;
  isTooltip?: boolean;
  tipfunc: any;
  isLegend?: boolean;
  legentd_verticalAlign?: VerticalAlignmentType | undefined;
  legentd_align?: HorizontalAlignmentType | undefined;
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc",
          }}
        >
          <label>{`${payload[0].name} : ${props.tipfunc(
            payload[0].value
          )}`}</label>
        </div>
      );
    }
    return null;
  };

  return (
    <React.Fragment>
      <PieChart width={props.width} height={props.height}>
        <React.Fragment>
          <Pie
            data={props.data}
            dataKey="value"
            nameKey="name"
            cx={`${props.cx}%`}
            cy={`${props.cy}%`}
            outerRadius={props.outerRadius || 80}
            labelLine={false}
            label={props.isLabel ? renderCustomizedLabel : false}
          >
            {props.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
            ))}
          </Pie>
          {props.isTooltip ? <Tooltip content={CustomTooltip} /> : null}
          {props.isLegend ? (
            <Legend
              verticalAlign={props.legentd_verticalAlign}
              align={props.legentd_align}
            />
          ) : null}
        </React.Fragment>
      </PieChart>
    </React.Fragment>
  );
};
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill={"#002884"}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
