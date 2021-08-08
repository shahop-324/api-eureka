import React, { useEffect, useState } from "react";
import Footer from "../../Footer";

import MenuIcon from "@material-ui/icons/Menu";

import CancelIcon from "@material-ui/icons/Cancel";
import "./../Styles/pricing.scss";

import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [hambergerOpen, setHambergerOpen] = useState(false);

  useEffect(() => {
    window.localStorage.clear();
  });

  const openHamberger = () => {
    setHambergerOpen(true);
  };

  const closeHamberger = () => {
    setHambergerOpen(false);
  };

  return (
    <>
      <div className="container-fluid p-0">
        <div className="header-section-home header-section">
          <div
            className="row nav-section"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            <nav class="navbar navbar-expand-xxl navbar-light">
              <div class="container">
                {/* // TODO LINK EVENZ LOGO EVERYWHERE TO HOME PAGE */}
                <span class="navbar-brand nav-brand-name-home">Evenz</span>

                <button
                  class="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  {hambergerOpen ? (
                    <CancelIcon
                      onClick={closeHamberger}
                      style={{ fill: "#ffffff" }}
                      className="navbar-toggler-icon"
                    />
                  ) : (
                    <MenuIcon
                      onClick={openHamberger}
                      style={{ fill: "#ffffff" }}
                      className="navbar-toggler-icon"
                    />
                  )}
                </button>
                <div
                  class="collapse navbar-collapse navbar-collapse-dark"
                  id="navbarSupportedContent"
                >
                  <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    {/* <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div className="nav-link-btn nav-link-btn-dark me-4">
                        Features
                      </div>
                    </li> */}
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div
                        className="nav-link-btn nav-link-btn-dark me-4"
                        style={{ fontWeight: "600" }}
                      >
                        <Link
                          to="/use-cases/"
                          style={{ textDecoration: "none", color: "#ffffff" }}
                        >
                          Use Cases
                        </Link>
                      </div>
                    </li>
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div
                        className="nav-link-btn nav-link-btn-dark me-4"
                        style={{ fontWeight: "600" }}
                      >
                        <Link
                          to="/search-events/"
                          style={{ textDecoration: "none", color: "#ffffff" }}
                        >
                          Explore Events
                        </Link>
                      </div>
                    </li>
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div
                        className="nav-link-btn nav-link-btn-dark me-4"
                        style={{ fontWeight: "600" }}
                      >
                        <Link to="/pricing/" style={{ textDecoration: "none", color: "#ffffff" }}>
                          Pricing
                        </Link>
                      </div>
                    </li>

                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <a
                        href="/signin"
                        type="button"
                        className=" btn btn-light btn-outline-text me-4"
                      >
                        Login
                      </a>
                    </li>

                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      {/* <AvatarMenu /> */}
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>

          <div className="pricing-section  py-4">
            <div className="pricing-heading-primary mt-5 mb-4">
              Built For Everyone
            </div>
            <div className="pricing-heading-secondary mb-4">
              Choose a plan that works for you
            </div>

            <div className="pricing-cards-grid-wrapper py-5">
              <div class="card__container grid" style={{ maxWidth: "1400px" }}>
                {/* <!--==================== CARD 1 ====================--> */}
                <article class="card__content grid">
                  <div class="card__pricing">
                    <div class="card__pricing-number">
                      <span class="card__pricing-symbol">$</span>0
                    </div>
                    <span class="card__pricing-month">/month</span>
                  </div>

                  <header class="card__header">
                    <div class="card__header-circle grid">
                      <img
                        src="https://fadzrinmadu.github.io/hosted-assets/responsive-pricing-card-using-html-and-css/free-coin.png"
                        alt=""
                        class="card__header-img"
                      />
                    </div>

                    <span class="card__header-subtitle mb-3">Free plan</span>
                    <h1 class="card__header-title mb-4">Basic</h1>
                  </header>

                  <ul class="card__list grid">
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">3 user request</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">10 downloads por day</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Daily content updates
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Fully editable files</p>
                    </li>
                  </ul>

                  <button
                    class="card__button btn btn-outline-primary btn-outline-text"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    Start my journey
                  </button>
                </article>

                {/* <!--==================== CARD 2 ====================--> */}
                <article
                  class="card__content pricing-card-2 grid"
                 
                >
                  <div class="card__pricing">
                    <div class="card__pricing-number">
                      <span class="card__pricing-symbol">$</span>79
                    </div>
                    <span class="card__pricing-month">/month</span>
                  </div>

                  <header class="card__header">
                    <div class="card__header-circle grid">
                      <img
                        src="https://fadzrinmadu.github.io/hosted-assets/responsive-pricing-card-using-html-and-css/pro-coin.png"
                        alt=""
                        class="card__header-img"
                      />
                    </div>

                    <span class="card__header-subtitle mb-3">Most popular</span>
                    <h1 class="card__header-title mb-4">Professional</h1>
                  </header>

                  <ul class="card__list grid">
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">100 user request</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Unlimited downloads</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Unlock all features from our site
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Daily content updates
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Fully editable files</p>
                    </li>
                  </ul>

                  <button class="card__button btn btn-primary btn-outline-text">
                    Choose this plan
                  </button>
                </article>

                {/* <!--==================== CARD 3 ====================--> */}
                <article class="card__content grid">
                  {/* <div class="card__pricing">
                    <div class="card__pricing-number">
                      <span class="card__pricing-symbol">$</span>29
                    </div>
                    <span class="card__pricing-month">/month</span>
                  </div> */}

                  <header class="card__header">
                    <div class="card__header-circle grid">
                      <img
                        src="https://fadzrinmadu.github.io/hosted-assets/responsive-pricing-card-using-html-and-css/enterprise-coin.png"
                        alt=""
                        class="card__header-img"
                      />
                    </div>

                    <span class="card__header-subtitle mb-3">For agencies</span>
                    <h1 class="card__header-title mb-4">Enterprise</h1>
                  </header>

                  <ul class="card__list grid">
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Unlimited user request
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Unlimited downloads</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Unlock all features from our site
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Daily content updates
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Fully editable files</p>
                    </li>
                  </ul>

                  <button class="card__button btn btn-primary btn-outline-text">
                    Talk to us
                  </button>
                </article>
              </div>
            </div>
          </div>

          <div className="FAQs-section px-4">
            <h2 className="mb-4">F.A.Q.</h2>
            <details>
              <summary>Question 1</summary>
              <p>
                Just use a <code>details</code> and <code>summary</code> tags
                with a little CSS, no more JS. You can use any text or emoji as
                caret.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Tempora in nihil, deleniti saepe optio corrupti dolorum
                perferendis hic iure, maiores quae vitae provident minus, ipsum,
                aut tempore facilis doloremque rem.
              </p>
            </details>
            <details>
              <summary>Question 2</summary>
              <p>
                Ipsa veritatis inventore reprehenderit dolorem, officiis.
                Quaerat doloribus voluptatibus impedit repellat quae
                perspiciatis nesciunt, recusandae facilis unde fugit et eaque
                rem voluptatum perferendis libero veniam rerum aliquam eos
                minima voluptate.
              </p>
            </details>
            <details>
              <summary>Question 3</summary>
              <p>
                Quisquam, necessitatibus quo dolore sequi suscipit magni,
                voluptatum debitis, accusantium dolorum officia beatae rerum
                similique optio saepe vel dicta facere modi, voluptatem culpa
                expedita quaerat eum reprehenderit dolores. Assumenda,
                doloremque!
              </p>
            </details>
            <details>
              <summary>Question 4</summary>
              <p>
                Dolorum quaerat facilis magnam commodi molestiae atque similique
                hic enim pariatur nulla magni amet iusto soluta nemo alias odit
                recusandae repudiandae dignissimos, fugit asperiores quia eius
                necessitatibus iure. Possimus, illum.
              </p>
            </details>
            <details>
              <summary>Question 5</summary>
              <p>
                Consequuntur voluptate consequatur sed adipisci libero
                temporibus atque itaque voluptas eos, rerum vero qui. Adipisci
                illum, molestias commodi unde necessitatibus ea, quod explicabo,
                deleniti voluptatem aliquam reprehenderit, nobis maiores. Saepe?
              </p>
            </details>
          </div>
        </div>

        {/* Pre Footer Here */}
        <Footer />
        {/* Footer */}
      </div>
    </>
  );
};

export default Pricing;
