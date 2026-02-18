import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import NewsBoard from './NewsBoard';

const News = () => {
  return (
  <div>
    <div className='m-20 dark:bg-slate-900 dark:text-white '>
     <h1 className="text-3xl font-semibold mb-4">Trading <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-Large text-red-700 ring-1 ring-inset ring-red-600/10">
       News
      </span></h1>
    <Navbar/>
    {/* <NewsBoard/> */}
    <div role="tablist" className="dark:bg-slate-900 dark:text-white tabs tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab" className="tab dark:bg-slate-900 dark:text-white" aria-label=" Headlines" />
  <div role="tabpanel" className="dark:bg-slate-900 dark:text-white tab-content bg-base-100 border-base-300 rounded-box p-6">
  <div className="dark:bg-slate-900 dark:text-white hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row dark:bg-slate-900 dark:text-white">
    <img
      src="https://assets1.cbsnewsstatic.com/hub/i/r/2024/12/26/00b7bce8-29e7-4256-99ed-bf6362ed881e/thumbnail/1280x720/896312b983486bc2e2e1963d184eac03/1225-en-livesay.jpg?v=fa9977353833f46f40b07abcd9d5240b"
      className="max-w-sm rounded-lg shadow-2xl" />
    <div>
      <h1 className="text-5xl font-bold">Plane crash in Kazakhstan killed dozens, but nearly half of those on board survived, officials say</h1>
      <p className="py-6">
      Moscow — An Azerbaijani airliner with 67 people on board crashed Wednesday in western Kazakhstan, near the city of Aktau, killing 38 people and leaving 29 survivors, a Kazakh official said.

Kazakh Deputy Prime Minister Kanat Bozumbaev disclosed the figures while meeting with Azerbaijani officials, the Russian news agency Interfax reported. 

Azerbaijan Airlines said 67 people were on board — 62 passengers and five crew members. Interfax quoted emergency workers at the scene as saying a preliminary assessment showed both pilots died in the crash.
      </p>
      <a  href='https://www.cbsnews.com/news/plane-crash-kazakhstan-dozens-dead-but-survivors/'
      className="btn btn-primary">Read More</a>
    </div>

    
  </div>
</div>
  </div>

  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab dark:bg-slate-900 dark:text-white"
    aria-label="Market"
    defaultChecked />
  <div role="tabpanel" className="dark:bg-slate-900 dark:text-white tab-content bg-base-100 border-base-300 rounded-box p-6">
  <div className="dark:bg-slate-900 dark:text-white hero bg-base-200 min-h-screen">
  <div className="dark:bg-slate-900 dark:text-white hero-content flex-col lg:flex-row-reverse">
    <img
      src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1wvKfO.img?w=768&h=512&m=6&x=736&y=396&s=66&d=66"
      className="max-w-sm rounded-lg shadow-2xl" />
    <div>
      <h1 className="text-5xl font-bold dark:bg-slate-900 dark:text-white"> Stock market today: Asian shares are mostly higher in thin post-Christmas holiday trading</h1>
      <p className="py-6">
      BANGKOK (AP) — Asian shares were mostly higher Thursday in thin post-Christmas holiday trading, while oil prices rose.

The futures for the S&P 500 and the Dow Jones Industrial Average were 0.2% lower after markets were closed Wednesday for the Christmas holiday.

Japan's Nikkei 225 index surged 1.1% to 39,568.06, on strong gains in retailers and tourism-related stocks after Japan agreed to ease visa conditions for Chinese tourists.
      </p>
      <a href='https://www.msn.com/en-us/money/other/stock-market-today-asian-shares-are-mostly-higher-in-thin-post-christmas-holiday-trading/ar-AA1wuWGC' className="btn btn-primary">Read More</a>
    </div>
  </div>
</div>
  </div>

  <input type="radio" name="my_tabs_2" role="tab" className="dark:bg-slate-900 dark:text-white tab" aria-label="Technologies" />
  <div role="tabpanel" className="dark:bg-slate-900 dark:text-white tab-content bg-base-100 border-base-300 rounded-box p-6">
  <div className="hero bg-base-200 min-h-screen dark:bg-slate-900 dark:text-white">
  <div className="hero-content flex-col lg:flex-row-reverse dark:bg-slate-900 dark:text-white">
    <img
      src="https://www.reuters.com/resizer/v2/HRJQ2RV6HBICDHKONYDZ6PMZRA.jpg?auth=62b5d649beb09e3b3bf11b6a0ef07a49d3484baa1d7140da03cbff0c21c7f7a0&width=720&quality=80"
      className="max-w-sm rounded-lg shadow-2xl" />
    <div>
      <h1 className="text-5xl font-bold">Toyota global production down for 10th month despite rising sales</h1>
      <p className="py-6 ">
      Toyota's U.S. output was down 11.8%, making a slow recovery although the production of Grand Highlander and Lexus TX SUV models resumed in late October after a four-month stoppage.
      </p>
      <a href='https://www.reuters.com/business/autos-transportation/toyota-global-production-down-10th-month-despite-rising-sales-2024-12-25/' className="btn btn-primary">Read More</a>
    </div>
  </div>
</div>
  </div>
</div>
  
  </div>
  <Footer/>
  </div>
  
  );
};

export default News;
