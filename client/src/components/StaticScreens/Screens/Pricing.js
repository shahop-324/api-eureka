import React, { useEffect } from "react";
import Footer from "../../Footer";

import "./../Styles/pricing.scss";

import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import TopNav from "../Helper/TopNav";
import { useSelector } from "react-redux";
import history from "../../../history";

const Pricing = () => {
  useEffect(() => {
    window.localStorage.clear();
  });

  const {isSignedIn} = useSelector((state) => state.auth);

  return (
    <>
      <div className="container-fluid p-0">
        <div className="header-section-home header-section">
          {/* Here Goes Top Nav */}

          <TopNav />

          <div className="pricing-section  py-4">
            <div className="pricing-heading-primary mt-5 mb-4">
              Built For <span style={{color: "#ffffff"}}>Everyone</span> 
            </div>
            <div className="pricing-heading-secondary mb-4">
              Choose a plan that works for you
            </div>

            <div className="pricing-cards-grid-wrapper py-5">
              <div class="card__container grid" style={{ maxWidth: "1600px" }}>
                {/* <!--==================== CARD 1 ====================--> */}
                <article class="card__content grid px-5" data-aos="zoom-in"
                data-aos-delay="100"
                data-aos-easing="ease-in-sine">
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
                      <p class="card__list-description">1 organiser</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">100 registrations</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        4 hours event length
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Ticketing and payment processing</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">1 Event Per Month</p>
                    </li>
                  </ul>

                  <button
                  onClick={() => {
                    isSignedIn ? alert("Show option to choose community from") : history.push('/login/buy-plan/?intent=buyPlan');
                  }}
                    class="card__button btn btn-outline-primary btn-outline-text"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    Start my journey
                  </button>
                </article>


                {/* <!--==================== CARD 1 ====================--> */}
                <article class="card__content grid px-5" data-aos="zoom-in"
                data-aos-delay="100"
                data-aos-easing="ease-in-sine">
                  <div class="card__pricing">
                    <div class="card__pricing-number">
                      <span class="card__pricing-symbol">$</span>49
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

                    <span class="card__header-subtitle mb-3">FOR INDIVIDUALS</span>
                    <h1 class="card__header-title mb-4">Starter</h1>
                  </header>

                  <ul class="card__list grid">
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Everything in basic and</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">2 organisers</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        300 registrations
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">24 hours event length</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Unlimited Coupons</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Access to Queries & Reviews</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Basic Analytics</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">3 Events per month</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Sharable Event Recordings</p>
                    </li>
                  </ul>

                  <button
                  onClick={() => {
                    isSignedIn ? alert("Show option to choose community from") : history.push('/login/buy-plan/?intent=buyPlan');
                  }}
                    class="card__button btn btn-outline-primary btn-outline-text"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    Start my journey
                  </button>
                </article>

                {/* <!--==================== CARD 2 ====================--> */}
                <article
                  class="card__content pricing-card-2 grid px-5"
                  data-aos="zoom-in"
                data-aos-delay="100"
                data-aos-easing="ease-in-sine"
                 
                >
                  <div class="card__pricing">
                    <div class="card__pricing-number">
                      <span class="card__pricing-symbol">$</span>99
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
                      <p class="card__list-description">Everything in starter and</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">4 organisers</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        1200 Registrations
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        72 hours event length
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Stage Customisation</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">RTMP & Custom streaming</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Full Access to networking and booths</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Marketing tools</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Access to integrations</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Real Time analytics</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Custom registration form</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Sponsors and shoutouts</p>
                    </li>
                  </ul>

                  <button onClick={() => {
                    isSignedIn ? alert("Show option to choose community from") : history.push('/login/buy-plan/?intent=buyPlan');
                  }} class="card__button btn btn-primary btn-outline-text">
                    Choose this plan
                  </button>
                </article>

                {/* <!--==================== CARD 3 ====================--> */}
                <article class="card__content grid px-5" data-aos="zoom-in"
                data-aos-delay="100"
                data-aos-easing="ease-in-sine">
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
                        Everything in Professional and
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Unlimited events</p>
                    </li>
                    
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        upto 1,00,000 registrations
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">SEO optimised Landing page</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">24 * 7 Support</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Onboarding session</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">99.99% Uptime SLA</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Unlock all features from evenz 
                      </p>
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
