import React from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import styled from "styled-components";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
import StackedBarChartRoundedIcon from "@mui/icons-material/StackedBarChartRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import BookRoundedIcon from "@mui/icons-material/BookRounded";

const Paper = styled.div`
  width: 100%;
  height: auto;
  background-color: #ffffff;

  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 24px;
`;

const WhatsNew = styled.div`
  height: 100%;
`;

const Products = styled.div`
  height: 100%;
  border-left: 1px solid #dbdbdb;
`;

const Platform = styled.div`
  height: 100%;
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: row;

  border-radius: 10px;
  padding: 10px;
  &:hover {
    background-color: #d4e3f6;
    cursor: pointer;
  }
`;

const ProductIcon = styled.div`
  border-radius: 10px;
  border: 1px solid #152d35;
  background-color: #152d3f;
  color: #ffffff;

  height: fit-content;
`;

const ProductName = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.82rem;
  color: #212121;
`;

const ProductCatchLine = styled.div`
  font-weight: 400;
  font-family: "Ubuntu";
  font-size: 0.78rem;
  color: #2c2c2c;
`;

const WhatsNewCard = styled.div`
  height: 160px;
  width: 100%;
  border: 1px solid #dadada;
  border-radius: 10px;

  &:hover {
    background-color: #d4e3f6;
    cursor: pointer;
    border: 1px solid #d4e3f6;
  }
`;

const NavSectionHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1rem;
  color: #212121;
`;

const WhatsNewHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.82rem;
  color: #333333;
`;

const WhatsNewParagraph = styled.p`
  font-weight: 400;
  font-family: "Ubuntu";
  font-size: 0.75rem;
  color: #333333;
`;

const ResourcesDrawer = ({ openDrawer, handleCloseDrawer }) => {
  return (
    <>
      <React.Fragment key="top">
        <SwipeableDrawer
          anchor="top"
          onOpen={() => {
            console.log("Side nav was opended");
          }}
          onClose={() => {
            console.log("Side nav was closed");
          }}
          open={openDrawer}
          disableBackdropTransition={true}
        >
          <Paper className="px-4 py-4 container">
            <WhatsNew className="px-3 py-3">
              <NavSectionHeading className="mb-3">What's new</NavSectionHeading>
              <WhatsNewCard className="mb-3 p-3">
                <WhatsNewHeading className="mb-3">
                  Unlocking Virtual Events: Bluemeet's First mega event
                </WhatsNewHeading>
                <WhatsNewParagraph>
                  This is one of a kind of live show in which event
                  professionals can participate, network and get to discuss
                  what's next for events industry. This event will be
                  broadcasted from New Delhi, India to the world on Bluemeet
                  platform.
                </WhatsNewParagraph>
              </WhatsNewCard>
            </WhatsNew>

            <Products className="px-4 py-3">
              <NavSectionHeading className="mb-5">Company</NavSectionHeading>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridGap: "36px",
                }}
              >
                <div>
                  <ProductCard className="mb-4">
                    <ProductIcon className="p-1 me-3">
                      <CircleRoundedIcon />
                    </ProductIcon>
                    <div>
                      <ProductName className="mb-2">Case studies</ProductName>
                      <ProductCatchLine>
                        See how Bluemeet helps team achieve their event goals
                      </ProductCatchLine>
                    </div>
                  </ProductCard>
                  <ProductCard className="mb-4">
                    <ProductIcon
                      className="p-1 me-3"
                      style={{
                        backgroundColor: "#EE4FCB",
                        border: "1px solid #EE4FCB",
                      }}
                    >
                      <StackedBarChartRoundedIcon />
                    </ProductIcon>
                    <div>
                      <ProductName className="mb-2">Blog</ProductName>
                      <ProductCatchLine>
                        The latest updates guides and stories from Bluemeet team
                      </ProductCatchLine>
                    </div>
                  </ProductCard>
                  <ProductCard className="mb-4">
                    <ProductIcon
                      className="p-1 me-3"
                      style={{
                        backgroundColor: "#EE674F",
                        border: "1px solid #EE674F",
                      }}
                    >
                      <AlbumRoundedIcon />
                    </ProductIcon>
                    <div>
                      <ProductName className="mb-2">
                        Bluemeet's certified Agency Partners
                      </ProductName>
                      <ProductCatchLine>
                        Bluemeet's partner agency who are expert in Bluemeet and
                        can help in elevating your virtual event
                      </ProductCatchLine>
                    </div>
                  </ProductCard>
                </div>

                <Platform>
                  <ProductCard className="mb-4">
                    <ProductIcon
                      className="p-1 me-3"
                      style={{
                        backgroundColor: "#EED921",
                        border: "1px solid #EED921",
                      }}
                    >
                      <HelpOutlineRoundedIcon />
                    </ProductIcon>
                    <div>
                      <ProductName className="mb-2">Support</ProductName>
                      <ProductCatchLine>
                        Got a question? Let's get answers to your questions.
                      </ProductCatchLine>
                    </div>
                  </ProductCard>
                  <ProductCard className="mb-4">
                    <ProductIcon
                      className="p-1 me-3"
                      style={{
                        backgroundColor: "#EE4F21",
                        border: "1px solid #EE4F21",
                      }}
                    >
                      <BookRoundedIcon />
                    </ProductIcon>
                    <div>
                      <ProductName className="mb-2">Bluemeet Learn</ProductName>
                      <ProductCatchLine>
                        Master the bluemeet platform from our event experts.
                      </ProductCatchLine>
                    </div>
                  </ProductCard>
                </Platform>
              </div>
            </Products>
          </Paper>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default ResourcesDrawer;
