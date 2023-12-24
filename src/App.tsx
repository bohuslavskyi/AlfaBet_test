import { Collapse, Drawer, Flex, Layout, Switch, Tabs, Steps } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import BetButton from "./components/bet-button/bet-button.tsx";
import { JSX, useEffect, useState } from "react";
import type { TabsProps } from "antd";
import c from "./App.module.scss";

const { Header, Content, Footer } = Layout;

const tabItems: TabsProps["items"] = [
  {
    key: "1",
    label: "Popular",
    children: "",
  },
  {
    key: "2",
    label: "Partido",
    children: "",
  },
  {
    key: "3",
    label: "Equipos",
    children: "",
  },
  {
    key: "5",
    label: "Jugadores",
    children: "",
  },
];

const MarketsData: IMarket[] = [
  {
    id: 1,
    marketTitle: "GANADOR",
    selections: [
      {
        id: 2,
        odds: "-118",
        market: "1",
        type: "small",
      },
      {
        id: 3,
        odds: "+270",
        market: "1",
        type: "small",
      },
      {
        id: 4,
        odds: "+300",
        market: "1",
        type: "small",
      },
    ],
  },
  {
    id: 5,
    marketTitle: "AMBOS EQUIPOS ANOTAN",
    selections: [
      {
        id: 6,
        odds: "-130",
        market: "Si",
        type: "",
      },
      {
        id: 7,
        odds: "+100",
        market: "No",
        type: "",
      },
    ],
  },
  {
    id: 8,
    marketTitle: "DOLBE OPORTUNIAD",
    selections: [
      {
        id: 9,
        odds: "-200",
        market: "Pumas unam/empate",
        type: "",
      },
      {
        id: 10,
        odds: "-400",
        market: "Pumas unam/América",
        type: "",
      },
      {
        id: 11,
        odds: "-264",
        market: "América/empate",
        type: "",
      },
    ],
  },
  {
    id: 12,
    marketTitle: "EMPATE NO ACCION",
    selections: [
      {
        id: 13,
        odds: "-270",
        market: "1",
        type: "small",
      },
      {
        id: 14,
        odds: "+187",
        market: "2",
        type: "small",
      },
    ],
  },
];

interface ISelection {
  id: number;
  odds: string;
  market: string;
  type: "small" | "";
}
interface IMarket {
  id: number;
  marketTitle: string;
  selections: ISelection[];
}
interface ICollapse {
  key: number;
  label: string;
  children: JSX.Element;
}
interface IActiveBets {
  [key: number]: number[];
}

function App() {
  // const [data, setData] = useState<IMarket[]>([]);
  const [openBetSlip, setOpenBetSlip] = useState<boolean>(false);
  const [collapseItems, setCollapseItems] = useState<ICollapse[]>();
  const [activeBets, setActiveBets] = useState<IActiveBets>({});

  const showDrawer = () => {
    setOpenBetSlip(true);
  };

  const onClose = () => {
    setOpenBetSlip(false);
  };

  const handleActiveBets = (marketId: number, selectId: number) => {
    setActiveBets((prev: IActiveBets) => {
      if (!!prev[marketId]) {
        return {
          ...prev,
          [marketId]: prev[marketId].includes(selectId)
            ? prev[marketId].filter((el) => el !== selectId)
            : [...prev[marketId], selectId],
        };
      }
      return { ...prev, [marketId]: [selectId] };
    });
  };

  const countOfActive = Object.values(activeBets).reduce((acc, current) => {
    return acc + current.length;
  }, 0);

  function isIActiveBets(obj: any): obj is IActiveBets {
    return typeof obj === "object" && obj !== null && !Array.isArray(obj);
  }

  const marketsSum = MarketsData.reduce((acc, market) => {
    let selectionsSum;
    if (isIActiveBets(activeBets) && !!activeBets[market.id]) {
      selectionsSum = market.selections.reduce((accum, el) => {
        if ((activeBets as IActiveBets)[market.id]?.includes(el.id)) {
          return eval(accum + el.odds);
        }
        return accum;
      }, 0);
    }
    return !!selectionsSum ? acc + selectionsSum : acc;
  }, 0);
  
  const setDraverCollapseItems = () => {
    const setItems = () => {
      return MarketsData.flatMap((market) => {
        if (market.id in activeBets) {
          return market.selections.flatMap((sel) => {
            if (activeBets[market.id].includes(sel.id)) {
              return {
                title: sel.market,
                description: market.marketTitle,
              };
            }
            return null;
          });
        }
        return [];
      });
    };
    
    return [
      {
        key: 1,
        label: "CREA TU APUESTA",
        children: (
            <div className={c.body}>
              <p className={c.title}>{countOfActive} SELECCIONES</p>
              <Steps
                  progressDot
                  current={100}
                  direction="vertical"
                  items={setItems()}
              />
            </div>
        ),
      },
      {
        key: 2,
        label: "SENCIALLAS",
        children: (
            <div className={c.body}>
              <p className={c.title}>{/* ... */}</p>
            </div>
        ),
      },
    ];
  };

  useEffect(() => {
    const collapses = MarketsData.map((el, i) => {
      return {
        key: i,
        label: el.marketTitle,
        children: (
          <div className={c.buttonWrap}>
            {el.selections.map((select) => {
              return (
                <BetButton
                  key={select.id}
                  active={
                    isIActiveBets(activeBets) &&
                    activeBets[el.id]?.includes(select.id)
                  }
                  select={select}
                  onClick={() => handleActiveBets(el.id, select.id)}
                />
              );
            })}
          </div>
        ),
      };
    });

    setCollapseItems(collapses);
  }, [activeBets]);

  return (
    <>
      <Drawer
        title="BOLETO"
        placement="right"
        onClose={onClose}
        open={openBetSlip}
        closeIcon={<LeftOutlined style={{ color: "#A60000" }} />}
        className={c.collapseWrap}
      >
        <Collapse
          className={c.collapse}
          items={setDraverCollapseItems()}
          // items={}
          defaultActiveKey={["0", "1", "2", "3"]}
        />
      </Drawer>
      <Layout className={c.layout}>
        <Header className={c.header}>Header</Header>
        <Content className={c.content}>
          <Flex vertical className={c.bet}>
            <Flex
              align="center"
              justify="space-between"
              className={c.betHeader}
            >
              <Flex align="center" gap={8} className={c.wrap}>
                <h2>+ Crea tu apuesta </h2>
                <i>i</i>
              </Flex>
              <Switch defaultChecked />
            </Flex>
            <Flex className={c.tabs}>
              <Tabs defaultActiveKey="1" items={tabItems} />
            </Flex>
            <Flex className={c.tabContent}>
              <Collapse
                className={c.collapse}
                items={collapseItems}
                defaultActiveKey={["0", "1", "2", "3"]}
              />
            </Flex>
          </Flex>
        </Content>
        <Footer className={c.footer}>
          {!!countOfActive && (
            <button className={c.betSlipBtn} onClick={showDrawer}>
              <Flex align="center" justify="space-between">
                <Flex align="center" className={c.wrap}>
                  <span className={c.betCount}>{countOfActive}</span>
                  <span className={c.title}>CREA TU APUESTA</span>
                </Flex>

                <span className={c.sum}>{marketsSum}</span>
              </Flex>
            </button>
          )}
        </Footer>
      </Layout>
    </>
  );
}

export default App;
