import React from "react";
import { Style, styled } from "../src";
import { any } from "prop-types";

type BaseProps = {
  [s: string]: any;
  children?: React.ReactChildren;
};

type DemoProps = {
  name: string;
};

export const Demo = ({ name, children }: BaseProps & DemoProps) => (
  <section>
    <Heading>{name}</Heading>
    {children}
  </section>
);

export const Heading = styled(
  {
    ":host": {
      margin: ["var(--grid)", 0]
    }
  },
  { name: ({ num }) => `h${num || 2}` }
);

export const Hr = styled({
  ":host": {
    borderBottom: "calc(var(--grid) / 10) solid black",
    marginBottom: "calc(var(--grid) * 2)",
    marginTop: "calc(var(--grid) * 2)"
  }
});

export const Text = ({ children, ...props }: BaseProps) => (
  <div>
    <Style>
      {{
        input: {
          borderRadius: "var(--border-radius)",
          border: "1px solid #ddd",
          fontSize: "calc(var(--font-size) / 1.2)",
          padding: "calc(var(--grid) / 4) calc(var(--grid) / 2)"
        }
      }}
    </Style>
    <label htmlFor={children}>{children}</label>{" "}
    <input id={children} {...props} />
  </div>
);

export const Theme = ({ children, ...props }: BaseProps & { grid: number }) => (
  <React.Fragment>
    <Style {...props}>
      {{
        ":root": ({ grid }) => ({
          "--border-radius": 4,
          "--grid": grid || 10,
          "--font-size": "1em",
          color: "#444",
          fontFamily: "Helvetica",
          fontSize: "var(--font-size)"
        })
      }}
    </Style>
    {children}
  </React.Fragment>
);
