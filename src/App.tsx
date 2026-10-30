/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

// Data types
interface Dish {
  name: string;
  price?: number;
  rating: string;
  reviews: string;
  isVeg: boolean;
  desc: string;
  img: string;
  category?: string;
}

interface CartItem extends Dish {
  qty: number;
}

interface FaqItem {
  question: string;
  answer: string;
}

const ALL_DISHES: Dish[] = [
  {
    name: 'Chicken Biryani',
    price: 89,
    rating: '4.1',
    reviews: '676',
    isVeg: true,
    desc: 'Puffed golden bhature served alongside slow-cooked spicy chickpeas with tangy house pickles and crisp onions.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlt-GPML9IDb7t0dgQGs7eipLliajlQXkb_OWHOrOLBHGNm61w6CLWM4DG3auLAMP_krnuIDnn3OyD5S0vpEg-YeveqkeZKdJOPaeVsktUUVHlmyOueA0asm8ngwsDSZ_OIaXpvvF1kJW9b-yVoNizbZadjyvgAl97tN4fLPv-clCdfd1YlShQhTWfhDtejyxtcbEzq12WnRFkkaSNwQctbNLWlLDKAZiydv-vxoaN-zSXgZGOW2J8Cnl9Qkrm2IJREw',
    category: 'North Indian'
  },
  {
    name: 'Gulab Jamun',
    price: 49,
    rating: '4.2',
    reviews: '2.2K+',
    isVeg: true,
    desc: 'Crispy savory wafers topped with diced potatoes, chilled sweetened yogurt, tamarind chutney, and fine sev.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASYniDhW358WFTMe05i1caGO5TsOhMzZRTa15mEMHs-sioqt2c6jliyQbn0mBV35dZy6FTt6XbPtE0uGyXSYLeMa3XIQXaLzLBRMaifgeW7nh-Y7GvX4ysYJKddlfKv48g-hU0JVD8w8KVVIu23d4CnKomwDefUg6FwMVfYqqAcPSvi71Xc2sR1ndIMbBf5Lhzr1BE0pPFR5M1CIfG_Nqh-D9EipvVH8NhdJ59Q0sbuBt1usExl2eJHmYSbENLukFFNw',
    category: 'Street Food'
  },
  {
    name: 'Paneer Butter Masala Thali',
    price: 99,
    rating: '4.3',
    reviews: '1.8K+',
    isVeg: true,
    desc: 'Soft cottage cheese cubes simmered in a velvety, buttery tomato gravy infused with fresh cream and aromatic spices.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASnmU-5AKndhCo0dK6S4NR2b-fNRUhD-nc96efW4-GoBRsT8Yy_p46tvAZbInZaXT9MfKPCuaus7qaf23j7L2hPdKug2KhcNZeZTIfQ2Mg-8lgFOqrOs25LBzCh22dVjYM5oKOO_KK2L6NzB9c-Dt4jBJ58UL4vhL6lOYPReZlMyDkOONdlCLZlbxogZ6IJHsUEomYrGzBKyghYj_aZwxb0QwJYFLQQj3ucGR9uGiPJgmKKDMtz-U0uNRnPkvTe4-KQg',
    category: 'North Indian'
  },
  {
    name: 'South Indian Thali',
    price: 79,
    rating: '4.4',
    reviews: '3.1K+',
    isVeg: true,
    desc: 'Golden roasted fermented rice crepe stuffed with spiced mustard-tempered potato masala, served with coconut chutney.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2ZWXMiGROl6gqPRYQgOZUSrkG5-X-EHrcbCkEPGn87vZ57bzUn2TpLUdjvLOFSgHmJ7ul2wEav5mvVhzUqlEL_F6DlrSwJaILxgVkU9gdfe6xO82bj_daED8lBJzpeki9uG7UwWggDw46eQ8NZA7Y4g7XUVs_hkVH-wp0yEHIyRvl1dQYl1VQ-rqjy3HX8j7GqUjzYCrB2IaOud7fUDcsFxjcgmXKRyTFXr7LkfvotVN8ZHv7Qy_fMhk9vL-VfHFP6Q',
    category: 'South Indian'
  },
  {
    name: 'Hakka Veg Noodles',
    price: 59,
    rating: '4.2',
    reviews: '950',
    isVeg: true,
    desc: 'Wok-tossed noodles with shredded cabbage, crunchy bell peppers, spring onions, and savory soy-garlic seasoning.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDisxBY74gw7GCxwjWGpplsgtAmjEECl419IMlAQTy5zc73fQuuw6f-3VGMXpT0opSdCVdEyOPQChOCix37T1zMvCJ5QVWHaVag-hdZjwnkANTN_rPL05M4dtdUtb0tk4kRhj189RoRdLOcTnWsVciHig10h93W8JKIRfZuc3uwtpAeUpgwcOimvaBJVs-Qv9pGkyOkiVDT-Fq-rHQ_KmvYkZuhgL7MX2puJ19yB021gd724o9-xxEnj96ouOvb6jFhyw',
    category: 'Chinese'
  },
  {
    name: 'Gulab Jamun Platter',
    price: 69,
    rating: '4.5',
    reviews: '1.4K+',
    isVeg: true,
    desc: 'Tender melt-in-mouth reduced milk dumplings soaked gently in rosewater and green cardamom scented sugar syrup.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASYniDhW358WFTMe05i1caGO5TsOhMzZRTa15mEMHs-sioqt2c6jliyQbn0mBV35dZy6FTt6XbPtE0uGyXSYLeMa3XIQXaLzLBRMaifgeW7nh-Y7GvX4ysYJKddlfKv48g-hU0JVD8w8KVVIu23d4CnKomwDefUg6FwMVfYqqAcPSvi71Xc2sR1ndIMbBf5Lhzr1BE0pPFR5M1CIfG_Nqh-D9EipvVH8NhdJ59Q0sbuBt1usExl2eJHmYSbENLukFFNw',
    category: 'Desserts'
  },
  {
    name: 'Classic Veg Burger',
    price: 35,
    rating: '4.1',
    reviews: '820',
    isVeg: true,
    desc: 'Crisp seasoned vegetable cutlet stacked with fresh vine tomatoes, crunchy lettuce, and herb mayonnaise on sesame bun.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQVX5rXm68FVSJ3b200ydjpxYKjH_gSHUadm0RD7SoSrROaqacdD6-2xq1NWF5Sowj6IOkBvhoQ2rGt3_l4B8GEH9jaFBZUCu_6JsO_oCRkjzGrOyLa020Qw-BsDxqaABo3GKJMqp2zuMlEOv3miSAtDxTUGeVM-1ShVmKlIPuLMHP-f-u01QQI6lbm0ily0Lu_eFs4IgXIWAgqNP5-hTZvU7mdFYAUmW47pw2Zy26mGUtAPNVzsVO59RYy4bBAhOggQ',
    category: 'Burger'
  },
  {
    name: 'Farmhouse Pizza',
    price: 95,
    rating: '4.3',
    reviews: '2.5K+',
    isVeg: true,
    desc: 'Fresh oven-baked crust smothered in spiced plum tomato marinara, melted mozzarella, bell peppers, corn and mushrooms.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAauCSDRFbKQdUMjvVBUfXif5ZR-U6h-ZTIplAmevzt2s4qRMiIhcKMFBpzM92hjOMxTqhtXxrzheCqNj45C82GVafCzhdzNF-UNMI4qfVGVQ4LkI61n-9Ax1gp_Weitu1T2XUGFCBqWmGHHZekz6Ebz7OSkqQFVp-FW8eNYAa64eRKJ1aVhAbfwNM-HRWsIn2ZOzDqvWyWnxG4H5-go8pSyH1ioLvCmxjp-8eqKqJtr6Lg9k6aoZ-6n1I8iZbJzncgLw',
    category: 'Pizza'
  },
  {
    name: 'Kathi Paneer Roll',
    price: 45,
    rating: '4.2',
    reviews: '1.1K+',
    isVeg: true,
    desc: 'Flaky handmade tawa paratha filled with smoky charred paneer tikka chunks, crisp onions, and refreshing mint chutney.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKJZNc9305vbuaEC5s0dVESSnK8hry-ccpWbpLNmLtDzQHA9QMJP0-OiA9DvOVtqfteuhTAs18Ti4z_DTkOYeZSFxCcllUJHRR5L4eY9nm42YYD-zLAc4gp9kA-5-IH9YvUhro8FNz7Vs5yD4WDMkZ6x8n91Ed8wX7RXMb8qzu641WWEkCbSi3Fv27kBLUJdvOgWUqgfZ-gxWTNX62hrQeYm-Xfy-BOJ7afM4SLqSkzFEtaLl4tBo7eds41DGHyzhBwQ',
    category: 'Rolls'
  },
  {
    name: 'Paneer Tikka Kebab',
    price: 85,
    rating: '4.4',
    reviews: '1.9K+',
    isVeg: true,
    desc: 'Tandoor-charred cottage cheese cubes skewered with bell peppers and onions, basted in spiced yogurt and mustard oil.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABojMXt9-VMXJx-QHppoH1glJFddfnDE7cBlgM5ywScp8aGt8jVX8O1rgyaYGFgL2NMtlmsr3YGhbI-J3VW8K1pqIJp7OLuiLmvIB39y5I2dEyqMhQIMkhk-N-B0414tHudJdAPoinwcJTMrcZ2uFnb6z2qJM150-_kNL0vN5Na-NXA-g-qr370NJmchVDRBaBX3NesD-r9FfPQVQs_dEqYb9MromLW8ujfibOxDZ_Gcn57ShqtnSD_q-3CxK_Q_MV0w',
    category: 'Kebabs'
  },
  {
    name: 'Steamed Veg Momos',
    price: 39,
    rating: '4.3',
    reviews: '3.4K+',
    isVeg: true,
    desc: 'Delicate Himalayan steamed dumplings stuffed with finely minced vegetables, served alongside hot garlic-chili dip.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwr47h35tNgGquncZTntEzqeG3AbU-JmHCmGrj6Lq17-Co73C0A6-mvJZgQmqUaOIUe-sau5--qt6-dksLCL5isOt1E3Jef9Ihln8Iq8ijfz6efV7ZDgcSzVJp3zbHv1JtXi2J3seYUEfz5El-rIzWprPyqs8-WaR-JlwZMeTtJra_b-G7E3eD23KqgH9MqEMrRXTM5udfc5_50R6N2jRG-3aZw5q3AwNYsV70Kq4FBGPRXgM_jrqqXI65tX835jDb4g',
    category: 'Momos'
  },
  {
    name: 'Tandoori Butter Roti',
    price: 25,
    rating: '4.1',
    reviews: '530',
    isVeg: true,
    desc: 'Crisp whole-wheat flatbread baked on the walls of a traditional clay tandoor and brushed with fresh golden butter.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASlrY6kKPdFj_BPBgkX0g053fR_ljgzmc1xnHdk5Zq2ijdyGU-W6vJnLmD-b-SUsmK2VgcgW-mmKsVtZhso-68ZeLFYPR5JhrHH_LOtYU60VNpPRDWpyPtIExfwvDhF1M_cF-zRYF7tKPe3ZCtM46nlOapyXc9wd-U340Sm2GMYAk7P2uHD8rABni2X98c7ohIfDAKMyfqO6OOES5STFrIn9NgKDNXGiT9k2rfAteJEuQiL8CakU6BqJ43Lk4Of02P4g',
    category: 'Roti'
  }
];

const CAROUSEL_BANNERS = [
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPIQykS8uRmBCPnZ7DFjz1k-otQGosvWUUC9UqMXCdFl3SIvBib4KvJj2vNWUIM7trzwWtWIKzaJsNkN6CKT-r5irrzLlhpWRZKtoWrnPyH8aTNr4RZ5i2ehgyKGwIFr0coZ0iBtzxX3rQFAjKHddULWF0dvZGQiYc0pFaslTZJ3BhVdXbekepXoenqn0hlhuUWEUr88Cy8sC2XGiqENBh98yzReLkDPSH6pAckt1qXNXKr4PDSfVKaPjxA_VnIWL93A',
    alt: 'Stunning Food Photos for Restaurants & Menus'
  },
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6KdgeUiP3C6y2bFtfCPpJLvhMCSvHJ_aqnUCj_bNJO1t0r_2N41NCQfmuxip1KdSyNRbTq91NUsc7Cu6lzP_tH_RQXvol_NCLQyqEEPBilNOgV_sRDuPxCF9261qHPeviV_zZU703x4Fd-lukDdeTdo4_LFStSYtvhVph2IhF9r7W2wDZlde3hrpyV5Vt533FA6Brpt5PAt2Az2nvEbz884xn3ckYw_y5P_2WZ8NucFRVFrD_ZlNJNL6Loo59cUVsbQ',
    alt: 'Showcase Your Dishes The Way They Deserve'
  },
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL5K88bWK24bXlhiOvfspVkg3kzKJlOXi-kbWo_R8tjuRpEbJhBudx_O5qOKxlkDVL7i7AUxVknlGyvDhX9ukojXd7NjaZ8sbnGvs6rur5rwBQRH__tAtcIJ38o2mJUZhuS4Yr8XDutf_1-CWrcNDEODm8IfQBjNb7F-FLI0dM0sD0J5B2vobqV4daMVjimrB98XtZ2mVgBR41O1LchWUilE0UEKBN9AYXTdtZ5lVWGDQEed6-Moo9_CYB1BjX8_2QJg',
    alt: 'Make Your Food Look Irresistible'
  },
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL_1EodnjC4L2dSS6I9TQcl5rXLQCCvo7moPd3mA0jX4C63OZPCvY1rXoF3y9HoQZTEra0hK04uU_QKbuuiEIZ1AlFov7ygsO-c4iPMEHvFKMTGOktDCc26BKrI8OVvdNHErI3cLfvj2N45Mo9XwxXR8eSIFJ1T8utSGIKV2idsCoAwziJrFwq5yJZbxvoCKx8owfrG1PskDeN8WTmRK9TBT17Jr7Eo3Bg2D0bxj1pRexzKKYxrluEHfzOBaJfgVF0pg',
    alt: 'Make Your Food Look Irresistible Platter'
  }
];

const CUISINES_ROW_1 = [
  { name: 'Biryani', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlt-GPML9IDb7t0dgQGs7eipLliajlQXkb_OWHOrOLBHGNm61w6CLWM4DG3auLAMP_krnuIDnn3OyD5S0vpEg-YeveqkeZKdJOPaeVsktUUVHlmyOueA0asm8ngwsDSZ_OIaXpvvF1kJW9b-yVoNizbZadjyvgAl97tN4fLPv-clCdfd1YlShQhTWfhDtejyxtcbEzq12WnRFkkaSNwQctbNLWlLDKAZiydv-vxoaN-zSXgZGOW2J8Cnl9Qkrm2IJREw' },
  { name: 'South Indian', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2ZWXMiGROl6gqPRYQgOZUSrkG5-X-EHrcbCkEPGn87vZ57bzUn2TpLUdjvLOFSgHmJ7ul2wEav5mvVhzUqlEL_F6DlrSwJaILxgVkU9gdfe6xO82bj_daED8lBJzpeki9uG7UwWggDw46eQ8NZA7Y4g7XUVs_hkVH-wp0yEHIyRvl1dQYl1VQ-rqjy3HX8j7GqUjzYCrB2IaOud7fUDcsFxjcgmXKRyTFXr7LkfvotVN8ZHv7Qy_fMhk9vL-VfHFP6Q' },
  { name: 'North Indian', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASnmU-5AKndhCo0dK6S4NR2b-fNRUhD-nc96efW4-GoBRsT8Yy_p46tvAZbInZaXT9MfKPCuaus7qaf23j7L2hPdKug2KhcNZeZTIfQ2Mg-8lgFOqrOs25LBzCh22dVjYM5oKOO_KK2L6NzB9c-Dt4jBJ58UL4vhL6lOYPReZlMyDkOONdlCLZlbxogZ6IJHsUEomYrGzBKyghYj_aZwxb0QwJYFLQQj3ucGR9uGiPJgmKKDMtz-U0uNRnPkvTe4-KQg' },
  { name: 'Chinese', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDisxBY74gw7GCxwjWGpplsgtAmjEECl419IMlAQTy5zc73fQuuw6f-3VGMXpT0opSdCVdEyOPQChOCix37T1zMvCJ5QVWHaVag-hdZjwnkANTN_rPL05M4dtdUtb0tk4kRhj189RoRdLOcTnWsVciHig10h93W8JKIRfZuc3uwtpAeUpgwcOimvaBJVs-Qv9pGkyOkiVDT-Fq-rHQ_KmvYkZuhgL7MX2puJ19yB021gd724o9-xxEnj96ouOvb6jFhyw' },
  { name: 'Desserts', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASYniDhW358WFTMe05i1caGO5TsOhMzZRTa15mEMHs-sioqt2c6jliyQbn0mBV35dZy6FTt6XbPtE0uGyXSYLeMa3XIQXaLzLBRMaifgeW7nh-Y7GvX4ysYJKddlfKv48g-hU0JVD8w8KVVIu23d4CnKomwDefUg6FwMVfYqqAcPSvi71Xc2sR1ndIMbBf5Lhzr1BE0pPFR5M1CIfG_Nqh-D9EipvVH8NhdJ59Q0sbuBt1usExl2eJHmYSbENLukFFNw' },
  { name: 'Ice Cream', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBejJ2PeuOBxAXIT7KJWRB2GhZrcJGJwjQwfolR6P-ykVJVfcrcs1vK3jrfGIO0hQ6lQQARw9L5YodKu7piclL-Svw5LLGdkTZ_fBKnXIm_vzXSkWZ3NbI5yqRKGP8Vt81Jwl6H6FCRlpoq5r665N9fz7BgF3akNXTvF7i6IzJuFtzTTiaRjcpX7aZTV_islWM9spHZrYe4dr6SbeR8wmLn3dP29ZF6NXQ5xIdDqknGLK5wRd_qWyLzqJweKvwrd_j0_w' },
  { name: 'Pasta', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjS56PiS63Wq1oZnwy7rnMqmhFBAXp90ugs9afQ0-k4Q02eFiqsHtbTmDd3LMAp9AR36bUm0CzUgTh_PO-BnY1VJhgfSfSV_4yBO7DXVE30S9MrW9xuMnkNdGW5WTB3wHLKGz86WpSyDcEbpTaBIrG6rK1uc3gzWdXPMG5KIlguwnlhyB4uMCMXyXnLXAO1JXUqGcKuxufnTTqImYMsRe4ds0071E0zwPg8SmxNlI9eHzGQaOGDZOobwXzxb9Ox_GRyg' },
  { name: 'Street Food', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPmQZe5lmXb1GeN15I-2nNRNvSxbB0aISxpAD28-fYtNnG-NbXXY0ClJt717B5ebM4oR9-t8saSzZ6El_okNxaQT3v_DAlJmKYkI3ioo2pq49wbHUB_oDXQUWoXwXyQEbSc5tQBsxlqzfTL09p33Pdl08FgBSaKXfMYokmylFgK2-N4od7xfse0hioBp6AtQ-UVmcgboXjtqiWpkfFMYJJiz7gWhZr0dyB0b_RQkcUGnRafd-mbbyV3-9f9rerEQF8dA' }
];

const CUISINES_ROW_2 = [
  { name: 'Burger', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQVX5rXm68FVSJ3b200ydjpxYKjH_gSHUadm0RD7SoSrROaqacdD6-2xq1NWF5Sowj6IOkBvhoQ2rGt3_l4B8GEH9jaFBZUCu_6JsO_oCRkjzGrOyLa020Qw-BsDxqaABo3GKJMqp2zuMlEOv3miSAtDxTUGeVM-1ShVmKlIPuLMHP-f-u01QQI6lbm0ily0Lu_eFs4IgXIWAgqNP5-hTZvU7mdFYAUmW47pw2Zy26mGUtAPNVzsVO59RYy4bBAhOggQ' },
  { name: 'Pizza', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAauCSDRFbKQdUMjvVBUfXif5ZR-U6h-ZTIplAmevzt2s4qRMiIhcKMFBpzM92hjOMxTqhtXxrzheCqNj45C82GVafCzhdzNF-UNMI4qfVGVQ4LkI61n-9Ax1gp_Weitu1T2XUGFCBqWmGHHZekz6Ebz7OSkqQFVp-FW8eNYAa64eRKJ1aVhAbfwNM-HRWsIn2ZOzDqvWyWnxG4H5-go8pSyH1ioLvCmxjp-8eqKqJtr6Lg9k6aoZ-6n1I8iZbJzncgLw' },
  { name: 'Rolls', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKJZNc9305vbuaEC5s0dVESSnK8hry-ccpWbpLNmLtDzQHA9QMJP0-OiA9DvOVtqfteuhTAs18Ti4z_DTkOYeZSFxCcllUJHRR5L4eY9nm42YYD-zLAc4gp9kA-5-IH9YvUhro8FNz7Vs5yD4WDMkZ6x8n91Ed8wX7RXMb8qzu641WWEkCbSi3Fv27kBLUJdvOgWUqgfZ-gxWTNX62hrQeYm-Xfy-BOJ7afM4SLqSkzFEtaLl4tBo7eds41DGHyzhBwQ' },
  { name: 'Kebabs', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABojMXt9-VMXJx-QHppoH1glJFddfnDE7cBlgM5ywScp8aGt8jVX8O1rgyaYGFgL2NMtlmsr3YGhbI-J3VW8K1pqIJp7OLuiLmvIB39y5I2dEyqMhQIMkhk-N-B0414tHudJdAPoinwcJTMrcZ2uFnb6z2qJM150-_kNL0vN5Na-NXA-g-qr370NJmchVDRBaBX3NesD-r9FfPQVQs_dEqYb9MromLW8ujfibOxDZ_Gcn57ShqtnSD_q-3CxK_Q_MV0w' },
  { name: 'Momos', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwr47h35tNgGquncZTntEzqeG3AbU-JmHCmGrj6Lq17-Co73C0A6-mvJZgQmqUaOIUe-sau5--qt6-dksLCL5isOt1E3Jef9Ihln8Iq8ijfz6efV7ZDgcSzVJp3zbHv1JtXi2J3seYUEfz5El-rIzWprPyqs8-WaR-JlwZMeTtJra_b-G7E3eD23KqgH9MqEMrRXTM5udfc5_50R6N2jRG-3aZw5q3AwNYsV70Kq4FBGPRXgM_jrqqXI65tX835jDb4g' },
  { name: 'Roti', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASlrY6kKPdFj_BPBgkX0g053fR_ljgzmc1xnHdk5Zq2ijdyGU-W6vJnLmD-b-SUsmK2VgcgW-mmKsVtZhso-68ZeLFYPR5JhrHH_LOtYU60VNpPRDWpyPtIExfwvDhF1M_cF-zRYF7tKPe3ZCtM46nlOapyXc9wd-U340Sm2GMYAk7P2uHD8rABni2X98c7ohIfDAKMyfqO6OOES5STFrIn9NgKDNXGiT9k2rfAteJEuQiL8CakU6BqJ43Lk4Of02P4g' },
  { name: 'Sandwich', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7ky6FPOx0hROm22znxOscktZjAhWYgW4331KUKjqNbZmdWxwiPAiRlgKN1G58FpnKoSttVooZuH4AJF22QYFItfSGQOtpKs8rae9I52HZsRsXEQxEe8WAalrjT0_QyEMbJ_nOksmvp6d2YFdoTfZa3anbeddeRtLqbgDZ5bd1fxybp2gzpbSgk0R8AzTdptk4H55hCK87DQmCKzqwKX7ezCVaVID5NNQmw5SFGmVgaflxlv5zbGxMGNsrbdEeRSpuiQ' },
  { name: 'Beverages', img: '/assets/aistudio/Beverages_5df70cc7.png' }
];

const SEARCH_TERMS_ROW_1 = [
  'North Indian',
  'Cake',
  'Pizza',
  'Coffee',
  'Waffles',
  'Beverages'
];

const SEARCH_TERMS_ROW_2 = [
  'Kebab',
  'Sandwich',
  'Street Food',
  'Fast Food',
  'Biryani',
  'Burger'
];

const SEARCH_TERMS = [...SEARCH_TERMS_ROW_1, ...SEARCH_TERMS_ROW_2];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is Foodbliz?',
    answer:
      'Foodbliz is a specialized food photography and visual production studio dedicated to crafting mouth-watering, high-converting culinary imagery for restaurants, cafes, cloud kitchens, and food brands.'
  },
  {
    question: 'What services does Foodbliz provide?',
    answer:
      'We provide comprehensive commercial food photography, restaurant menu visuals, social media content packages, e-commerce dish photography, chef portraiture, and promotional food banners tailored for digital platforms and print menus.'
  },
  {
    question: 'How does the food photography service work?',
    answer:
      'Our process is simple: choose a package that fits your menu size, schedule an on-site or studio shoot session, prepare your dishes with our culinary stylists, and receive professionally edited, color-graded, high-resolution digital assets ready for deployment.'
  },
  {
    question: 'Who can use Foodbliz?',
    answer:
      'Foodbliz is built for restaurants, cafes, cloud kitchens, bakeries, food trucks, quick-service food chains, culinary creators, and hospitality businesses looking to elevate their menu presentation and online orders.'
  },
  {
    question: 'How do I choose the right package?',
    answer:
      'Select a package based on your total dish count, styling requirements, and distribution channels. We offer flexible starter tiers for seasonal menus up to comprehensive visual packages for multi-outlet restaurant chains.'
  },
  {
    question: 'How do I submit my food/items for photography?',
    answer:
      'You can either book an on-site photoshoot where our team visits your commercial kitchen with studio lighting and gear, or send packaged, shelf-stable items directly to our dedicated culinary studio.'
  },
  {
    question: 'How long does it take to receive the final images?',
    answer:
      'Standard post-production and professional color grading take 3 to 5 business days after the shoot. Express delivery options (within 48 hours) are also available upon request.'
  },
  {
    question: 'Can I request revisions?',
    answer:
      'Yes, all packages include one round of fine-tuning adjustments for color tone, crop, and contrast to ensure every dish meets your exact brand guidelines and visual preferences.'
  },
  {
    question: 'Can I use the images on Zomato, Swiggy, Instagram and other platforms?',
    answer:
      'Yes, you receive full commercial usage rights. The final files are pre-formatted and optimized for food delivery platforms like Zomato and Swiggy, social channels like Instagram, and print marketing materials.'
  },
  {
    question: 'How can I contact Foodbliz?',
    answer:
      'You can reach our team directly via our Contact Us form, email us at support@foodbliz.com, or call our customer desk. We are available Monday through Saturday to answer inquiries and schedule consultations.'
  }
];

// FOODBLIZ PACKAGES DATA
interface PackagePlan {
  id: string;
  name: string;
  items: string;
  price: string;
  period?: string;
  cta: string;
  isPopular: boolean;
}

const STANDARD_PACKAGES: PackagePlan[] = [
  {
    id: 'starter',
    name: 'STARTER',
    items: '5 Food Images',
    price: '999',
    cta: 'Buy Now',
    isPopular: false
  },
  {
    id: 'growth',
    name: 'GROWTH',
    items: '10 Food Images',
    price: '1,999',
    cta: 'Buy Now',
    isPopular: true
  },
  {
    id: 'pro',
    name: 'PRO',
    items: '25 Food Images',
    price: '3,999',
    cta: 'Buy Now',
    isPopular: false
  }
];

const SUBSCRIPTION_PACKAGES: PackagePlan[] = [
  {
    id: 'monthly-starter',
    name: 'MONTHLY STARTER',
    items: '10 Images / Month',
    price: '1,499',
    period: '/ month',
    cta: 'Subscribe Now',
    isPopular: false
  },
  {
    id: 'monthly-growth',
    name: 'MONTHLY GROWTH',
    items: '25 Images / Month',
    price: '2,999',
    period: '/ month',
    cta: 'Subscribe Now',
    isPopular: true
  },
  {
    id: 'monthly-pro',
    name: 'MONTHLY PRO',
    items: '50 Images / Month',
    price: '4,999',
    period: '/ month',
    cta: 'Subscribe Now',
    isPopular: false
  }
];

// GROWTH STATISTICS COMPONENT WITH REPEATING COUNT-UP ANIMATION
const GrowthStatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState({
    dishes: '0+',
    partners: '0+',
    satisfaction: '0%',
    lift: '0x'
  });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const DURATION = 1800; // 1.8 seconds

    const resetValues = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setCounts({
        dishes: '0+',
        partners: '0+',
        satisfaction: '0%',
        lift: '0x'
      });
    };

    const startAnimation = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Respect reduced-motion accessibility preference
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        setCounts({
          dishes: '12,000+',
          partners: '550+',
          satisfaction: '99.8%',
          lift: '3.5x'
        });
        return;
      }

      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / DURATION, 1);

        // Smooth cubic deceleration easing
        const eased = 1 - Math.pow(1 - progress, 3);

        const currentDishes = Math.floor(eased * 12000);
        const currentPartners = Math.floor(eased * 550);
        const currentSat = (eased * 99.8).toFixed(1);
        const currentLift = (eased * 3.5).toFixed(1);

        if (progress < 1) {
          setCounts({
            dishes: `${currentDishes.toLocaleString('en-US')}+`,
            partners: `${currentPartners}+`,
            satisfaction: `${currentSat}%`,
            lift: `${currentLift}x`
          });
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          setCounts({
            dishes: '12,000+',
            partners: '550+',
            satisfaction: '99.8%',
            lift: '3.5x'
          });
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
          } else {
            resetValues();
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-neutral-900 text-white py-10 sm:py-14 md:py-16 px-2 min-[360px]:px-4 sm:px-8 lg:px-12">
      <div className="w-full max-w-6xl xl:max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-[12px] min-[320px]:text-[13.5px] min-[360px]:text-[14.5px] min-[390px]:text-[16px] min-[430px]:text-[17.5px] sm:text-2xl md:text-3xl font-black text-white tracking-tight whitespace-nowrap sm:whitespace-normal">
            Trusted by Food Businesses Nationwide
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 mt-2">
            Our impact on restaurant menus, delivery orders, and customer engagement.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-1.5 min-[380px]:gap-2 sm:gap-6 text-center">
          <div className="p-2 min-[380px]:p-2.5 sm:p-6 lg:p-8 border border-neutral-800 rounded-lg sm:rounded-xl bg-neutral-800/50 flex flex-col justify-center items-center">
            <p className="text-sm min-[360px]:text-base min-[400px]:text-lg sm:text-3xl lg:text-4xl font-black text-[#E50914] mb-0.5 sm:mb-1 tracking-tight leading-none sm:leading-tight">
              {counts.dishes}
            </p>
            <p className="text-[9px] min-[360px]:text-[10px] min-[400px]:text-[11px] sm:text-sm text-gray-300 font-medium leading-tight">
              Dishes Photographed
            </p>
          </div>
          <div className="p-2 min-[380px]:p-2.5 sm:p-6 lg:p-8 border border-neutral-800 rounded-lg sm:rounded-xl bg-neutral-800/50 flex flex-col justify-center items-center">
            <p className="text-sm min-[360px]:text-base min-[400px]:text-lg sm:text-3xl lg:text-4xl font-black text-[#E50914] mb-0.5 sm:mb-1 tracking-tight leading-none sm:leading-tight">
              {counts.partners}
            </p>
            <p className="text-[9px] min-[360px]:text-[10px] min-[400px]:text-[11px] sm:text-sm text-gray-300 font-medium leading-tight">
              Restaurant Partners
            </p>
          </div>
          <div className="p-2 min-[380px]:p-2.5 sm:p-6 lg:p-8 border border-neutral-800 rounded-lg sm:rounded-xl bg-neutral-800/50 flex flex-col justify-center items-center">
            <p className="text-sm min-[360px]:text-base min-[400px]:text-lg sm:text-3xl lg:text-4xl font-black text-[#E50914] mb-0.5 sm:mb-1 tracking-tight leading-none sm:leading-tight">
              {counts.satisfaction}
            </p>
            <p className="text-[9px] min-[360px]:text-[10px] min-[400px]:text-[11px] sm:text-sm text-gray-300 font-medium leading-tight">
              Client Satisfaction
            </p>
          </div>
          <div className="p-2 min-[380px]:p-2.5 sm:p-6 lg:p-8 border border-neutral-800 rounded-lg sm:rounded-xl bg-neutral-800/50 flex flex-col justify-center items-center">
            <p className="text-sm min-[360px]:text-base min-[400px]:text-lg sm:text-3xl lg:text-4xl font-black text-[#E50914] mb-0.5 sm:mb-1 tracking-tight leading-none sm:leading-tight">
              {counts.lift}
            </p>
            <p className="text-[9px] min-[360px]:text-[10px] min-[400px]:text-[11px] sm:text-sm text-gray-300 font-medium leading-tight">
              Average Order Lift
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// TESTIMONIALS DATA
interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: `"Foodbliz transformed our cloud kitchen menu. Orders jumped by 40% within the first week of updating our dish photos!"`,
    author: "Rohan Sharma",
    role: "Founder, Urban Spice Kitchen"
  },
  {
    quote: `"The best food photography partner we've ever worked with. Professional styling, prompt delivery, and stunning visual quality."`,
    author: "Ananya Roy",
    role: "Operations Head, Bistro 9"
  },
  {
    quote: `"Our customers constantly compliment our menu photos. Foodbliz knows exactly how to make food look mouthwatering."`,
    author: "Chef Vikram Mehta",
    role: "The Crust & Co."
  }
];

const TestimonialsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const cards = container.querySelectorAll<HTMLElement>('.testimonial-card');
    if (!cards.length) return;

    let closest = 0;
    let minDiff = Infinity;
    cards.forEach((card, idx) => {
      const diff = Math.abs((card.offsetLeft - container.offsetLeft) - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closest = idx;
      }
    });
    setActiveSlide(closest);
  };

  const scrollToSlide = (index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cards = container.querySelectorAll<HTMLElement>('.testimonial-card');
    if (cards[index]) {
      const card = cards[index];
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft,
        behavior: 'smooth'
      });
      setActiveSlide(index);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cards = container.querySelectorAll<HTMLElement>('.testimonial-card');
    if (!cards.length) return;

    if (direction === 'right') {
      const nextSlide = (activeSlide + 1) % cards.length;
      scrollToSlide(nextSlide);
    } else {
      const prevSlide = (activeSlide - 1 + cards.length) % cards.length;
      scrollToSlide(prevSlide);
    }
  };

  return (
    <section className="w-full bg-white py-10 sm:py-14 md:py-16 px-4 sm:px-8 lg:px-12 overflow-hidden">
      <div className="w-full max-w-6xl xl:max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            What Restaurant Owners Say
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Real feedback from founders and chefs who partnered with Foodbliz.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full">
          {/* Previous Arrow Button (Desktop/Tablet) */}
          <button
            aria-label="Previous testimonial"
            type="button"
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 bg-white rounded-full shadow-md border border-gray-200 items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 hover:shadow-lg transition-all focus:outline-none cursor-pointer"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Next Arrow Button (Desktop/Tablet) */}
          <button
            aria-label="Next testimonial"
            type="button"
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 bg-white rounded-full shadow-md border border-gray-200 items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 hover:shadow-lg transition-all focus:outline-none cursor-pointer"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Horizontal Scroll Track */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex items-stretch gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar py-2 px-1"
          >
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="testimonial-card snap-start shrink-0 w-[84%] sm:w-[calc(50%-12px)] lg:w-[calc(50%-16px)] border border-gray-200 rounded-2xl bg-gray-50 p-6 lg:p-8 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-shadow min-h-[200px] sm:min-h-[220px]"
              >
                <p className="text-xs sm:text-sm md:text-base text-gray-700 italic leading-relaxed mb-4">
                  {t.quote}
                </p>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-gray-900">{t.author}</p>
                  <p className="text-[11px] sm:text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to testimonial ${index + 1}`}
              onClick={() => scrollToSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
                activeSlide === index
                  ? 'bg-[#E50914] w-6'
                  : 'bg-gray-300 hover:bg-gray-400 w-2.5'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default function App() {
  // Ticker pause state
  const [tickerPaused, setTickerPaused] = useState(false);

  // Mobile navigation drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Category in Hero
  const [activeCategory, setActiveCategory] = useState<string>('dish-photos');

  // Media dropdown in search
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<'Photos' | 'Videos' | 'Banners' | 'Templates' | 'Video' | 'Banner' | 'Template'>('Photos');
  const mediaDropdownRef = useRef<HTMLDivElement>(null);

  // Search input & query
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Banner Carousel
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Cuisine Carousel
  const cuisineContainerRef = useRef<HTMLDivElement>(null);
  const [cuisinePage, setCuisinePage] = useState<number>(0);

  // Dishes Grid & Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const dishesGridRef = useRef<HTMLDivElement>(null);

  // FAQ Modal & Accordion State
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Contact Modal & Form State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    query: ''
  });

  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Current Page Route: 'home', 'packages', or 'about'
  const [currentRoute, setCurrentRoute] = useState<'home' | 'packages' | 'about'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#packages') return 'packages';
      if (window.location.hash === '#about') return 'about';
    }
    return 'home';
  });

  // Packages Tab: 'standard' or 'subscription'
  const [packagesTab, setPackagesTab] = useState<'standard' | 'subscription'>('standard');

  // Login / Signup Modal State
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
    fullName: ''
  });

  // Modal Dish Info
  const [selectedModalDish, setSelectedModalDish] = useState<Dish | null>(null);

  // Cart state
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Toast confirmation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const addToCart = (dish: Dish) => {
    setCart((prev) => {
      const existing = prev[dish.name];
      if (existing) {
        return { ...prev, [dish.name]: { ...existing, qty: existing.qty + 1 } };
      }
      return { ...prev, [dish.name]: { ...dish, qty: 1 } };
    });
    showToast(`Added ${dish.name} to cart!`);
  };

  const updateCartQty = (name: string, delta: number) => {
    setCart((prev) => {
      const existing = prev[name];
      if (!existing) return prev;
      const newQty = existing.qty + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      }
      return { ...prev, [name]: { ...existing, qty: newQty } };
    });
  };

  const totalCartCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);

  // Banner carousel auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Close media dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (mediaDropdownRef.current && !mediaDropdownRef.current.contains(e.target as Node)) {
        setMediaDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFaqModalOpen(false);
        setContactModalOpen(false);
        setLoginModalOpen(false);
        setSelectedModalDish(null);
        setCartDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for hash changes to navigate between Home, Packages, and About
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#packages') {
        setCurrentRoute('packages');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#about') {
        setCurrentRoute('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#home' || !window.location.hash) {
        setCurrentRoute('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Prevent background website scrolling when modal is open
  useEffect(() => {
    const isAnyModalOpen = loginModalOpen || faqModalOpen || contactModalOpen || !!selectedModalDish || cartDrawerOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loginModalOpen, faqModalOpen, contactModalOpen, selectedModalDish, cartDrawerOpen]);

  // Cuisine scroll sync
  const scrollCuisine = (direction: 'left' | 'right') => {
    if (cuisineContainerRef.current) {
      const step = Math.max(320, Math.floor(cuisineContainerRef.current.clientWidth * 0.65));
      const delta = direction === 'left' ? -step : step;
      cuisineContainerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  const scrollToCuisinePage = (page: number) => {
    setCuisinePage(page);
    if (cuisineContainerRef.current) {
      const maxScroll = cuisineContainerRef.current.scrollWidth - cuisineContainerRef.current.clientWidth;
      cuisineContainerRef.current.scrollTo({ left: page === 1 ? maxScroll : 0, behavior: 'smooth' });
    }
  };

  // Popular Dishes: All 12 food tiles are fully preserved and always rendered
  const displayedDishes = React.useMemo(() => {
    const shift = (currentPage - 1) % ALL_DISHES.length;
    return [...ALL_DISHES.slice(shift), ...ALL_DISHES.slice(0, shift)];
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < 14413 ? prev + 1 : prev));
    if (dishesGridRef.current) {
      dishesGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
    if (dishesGridRef.current) {
      dishesGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToDishes = () => {
    if (dishesGridRef.current) {
      dishesGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      showToast('Please enter your email address.');
      return;
    }
    showToast('Thank you! You are subscribed to Foodbliz updates.');
    setNewsletterEmail('');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.query.trim()) {
      showToast('Please fill in Name, Email, and Query.');
      return;
    }
    showToast(`Thank you, ${contactForm.name.trim()}! We received your message.`);
    setContactForm({ name: '', email: '', phone: '', query: '' });
    setContactModalOpen(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.identifier.trim() || !loginForm.password.trim()) {
      showToast('Please enter both identifier and password.');
      return;
    }
    if (isSignUpMode) {
      showToast(`Welcome to Foodbliz, ${loginForm.fullName || loginForm.identifier}! Account created.`);
    } else {
      showToast(`Welcome back, ${loginForm.identifier}! Logged in successfully.`);
    }
    setLoginModalOpen(false);
    setLoginForm({ identifier: '', password: '', fullName: '' });
  };

  const handlePackageSelect = (pkgName: string, price: string, type: 'standard' | 'subscription') => {
    if (type === 'standard') {
      showToast(`${pkgName} package (₹${price}) selected! Ready for booking.`);
    } else {
      showToast(`${pkgName} plan (₹${price}/month) selected! Contacting plans team.`);
    }
  };

  const handleExploreNow = () => {
    setCurrentRoute('home');
    window.location.hash = '#dishes';
    setTimeout(() => {
      scrollToDishes();
    }, 50);
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col items-stretch justify-start antialiased selection:bg-red-500 selection:text-white overflow-x-hidden text-gray-900" id="home">
      {/* 1. TRENDING FOOD PICTURES TICKER */}
      <section aria-label="Trending Food Pictures Ticker" className="w-full bg-white overflow-hidden shadow-xs">
        <div
          className={`ticker-container relative w-full bg-white ticker-border h-[100px] flex items-center overflow-hidden select-none ${
            tickerPaused ? 'is-paused' : ''
          }`}
          id="ticker-box"
        >
          <div className="absolute top-0 left-0 bg-ticker-red text-white text-[12px] sm:text-[13px] font-extrabold tracking-wider uppercase px-3 py-[3px] z-20 pointer-events-none rounded-br-[1px] leading-tight">
            TRENDING FOOD PICTURES
          </div>

          <div className="w-full h-full overflow-hidden flex items-center pl-2 pr-11">
            <div className="marquee-track h-full items-center" id="marquee-track">
              {/* Set 1 */}
              <div className="flex items-center h-full">
                <article className="flex items-center px-4 h-full item-divider flex-shrink-0 cursor-pointer" style={{ width: '320px' }} onClick={() => handleTagClick('Biryani')}>
                  <div className="w-[84px] h-[78px] flex-shrink-0 flex items-center justify-center mr-3">
                    <img
                      alt="Mouth-Watering Biryani"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlt-GPML9IDb7t0dgQGs7eipLliajlQXkb_OWHOrOLBHGNm61w6CLWM4DG3auLAMP_krnuIDnn3OyD5S0vpEg-YeveqkeZKdJOPaeVsktUUVHlmyOueA0asm8ngwsDSZ_OIaXpvvF1kJW9b-yVoNizbZadjyvgAl97tN4fLPv-clCdfd1YlShQhTWfhDtejyxtcbEzq12WnRFkkaSNwQctbNLWlLDKAZiydv-vxoaN-zSXgZGOW2J8Cnl9Qkrm2IJREw"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] leading-tight font-bold text-gray-950 line-clamp-1">Mouth-Watering Biryani Pictures</h3>
                    <p className="text-[11.5px] leading-[1.3] text-gray-600 mt-1 line-clamp-2">Rich, aromatic and appetizing biryani visuals designed to sell the dish.</p>
                  </div>
                </article>

                <article className="flex items-center px-4 h-full item-divider flex-shrink-0 cursor-pointer" style={{ width: '320px' }} onClick={() => handleTagClick('Beverages')}>
                  <div className="w-[84px] h-[78px] flex-shrink-0 flex items-center justify-center mr-3">
                    <img
                      alt="Refreshing Beverage Photography"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT3XQjszc8I6nO9wCY7pJ_zbzLYsH1Bqcpeibh9EKZsEh07RN5tSRglrXcmck--RqpgRd_l9wbQWE9iUTA6iLF240C_iW_KRwB3AzoRxSGpdZzPqPS7t4Tz0SXdFVVqMCeSl6yjwXYq2jm-Sz7Ibad-2XEvOT7gKqnf2HcDrgiwYq0rrdw67C0PvNBV_1j84pGexSwOXOLNbpmV3dA01diq0B9uVv8GnhkiILjZlj2Fs-UZCtbtzs47cidF-KBY1aPjQ"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] leading-tight font-bold text-gray-950 line-clamp-1">Refreshing Beverage Photography</h3>
                    <p className="text-[11.5px] leading-[1.3] text-gray-600 mt-1 line-clamp-2">Fresh, vibrant and premium drink visuals for menus and social media.</p>
                  </div>
                </article>

                <article className="flex items-center px-4 h-full item-divider flex-shrink-0 cursor-pointer" style={{ width: '320px' }} onClick={() => handleTagClick('Fast Food')}>
                  <div className="w-[84px] h-[78px] flex-shrink-0 flex items-center justify-center mr-3">
                    <img
                      alt="Best Fast Food Pictures"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhiIjt531ELW-ka9Y-0b7j_tbPiJDdgQZBaRISoM56n3hctxkPpgWeoAuW9t_7LmURCHr30cgS34CBsXWHpjtD_Vy0t6MZtx-8sDExObVm8GTNk2liQcHiVALPPC19xBAXvospt63HKL6ZTb4ds9o4Fey97CNfS0DAPbOEh161dLkHa17q5i5afUMf3x7tcmJSPGmLuZXqNuJLERYfuFGLasNlsHjMANCfDUMNGFTyxqSSIuIrtqd9OkQjBEkjZ5Or0w"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] leading-tight font-bold text-gray-950 line-clamp-1">Best Fast Food Pictures</h3>
                    <p className="text-[11.5px] leading-[1.3] text-gray-600 mt-1 line-clamp-2">Crispy, tempting and restaurant-ready food photography.</p>
                  </div>
                </article>

                <article className="flex items-center px-4 h-full item-divider flex-shrink-0 cursor-pointer" style={{ width: '320px' }} onClick={() => handleTagClick('Biryani')}>
                  <div className="w-[84px] h-[78px] flex-shrink-0 flex items-center justify-center mr-3">
                    <img
                      alt="Mouth-Watering Biryani"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlt-GPML9IDb7t0dgQGs7eipLliajlQXkb_OWHOrOLBHGNm61w6CLWM4DG3auLAMP_krnuIDnn3OyD5S0vpEg-YeveqkeZKdJOPaeVsktUUVHlmyOueA0asm8ngwsDSZ_OIaXpvvF1kJW9b-yVoNizbZadjyvgAl97tN4fLPv-clCdfd1YlShQhTWfhDtejyxtcbEzq12WnRFkkaSNwQctbNLWlLDKAZiydv-vxoaN-zSXgZGOW2J8Cnl9Qkrm2IJREw"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] leading-tight font-bold text-gray-950 line-clamp-1">Mouth-Watering Biryani Pictures</h3>
                    <p className="text-[11.5px] leading-[1.3] text-gray-600 mt-1 line-clamp-2">Rich, aromatic and appetizing biryani visuals designed to sell the dish.</p>
                  </div>
                </article>

                <article className="flex items-center px-4 h-full item-divider flex-shrink-0 cursor-pointer" style={{ width: '320px' }} onClick={() => handleTagClick('Beverages')}>
                  <div className="w-[84px] h-[78px] flex-shrink-0 flex items-center justify-center mr-3">
                    <img
                      alt="Refreshing Beverage Photography"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT3XQjszc8I6nO9wCY7pJ_zbzLYsH1Bqcpeibh9EKZsEh07RN5tSRglrXcmck--RqpgRd_l9wbQWE9iUTA6iLF240C_iW_KRwB3AzoRxSGpdZzPqPS7t4Tz0SXdFVVqMCeSl6yjwXYq2jm-Sz7Ibad-2XEvOT7gKqnf2HcDrgiwYq0rrdw67C0PvNBV_1j84pGexSwOXOLNbpmV3dA01diq0B9uVv8GnhkiILjZlj2Fs-UZCtbtzs47cidF-KBY1aPjQ"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] leading-tight font-bold text-gray-950 line-clamp-1">Refreshing Beverage Photography</h3>
                    <p className="text-[11.5px] leading-[1.3] text-gray-600 mt-1 line-clamp-2">Fresh, vibrant and premium drink visuals for menus and social media.</p>
                  </div>
                </article>

                <article className="flex items-center px-4 h-full item-divider flex-shrink-0 cursor-pointer" style={{ width: '320px' }} onClick={() => handleTagClick('Fast Food')}>
                  <div className="w-[84px] h-[78px] flex-shrink-0 flex items-center justify-center mr-3">
                    <img
                      alt="Best Fast Food Pictures"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhiIjt531ELW-ka9Y-0b7j_tbPiJDdgQZBaRISoM56n3hctxkPpgWeoAuW9t_7LmURCHr30cgS34CBsXWHpjtD_Vy0t6MZtx-8sDExObVm8GTNk2liQcHiVALPPC19xBAXvospt63HKL6ZTb4ds9o4Fey97CNfS0DAPbOEh161dLkHa17q5i5afUMf3x7tcmJSPGmLuZXqNuJLERYfuFGLasNlsHjMANCfDUMNGFTyxqSSIuIrtqd9OkQjBEkjZ5Or0w"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] leading-tight font-bold text-gray-950 line-clamp-1">Best Fast Food Pictures</h3>
                    <p className="text-[11.5px] leading-[1.3] text-gray-600 mt-1 line-clamp-2">Crispy, tempting and restaurant-ready food photography.</p>
                  </div>
                </article>
              </div>

              {/* Set 2 duplicate for continuous marquee */}
              <div aria-hidden="true" className="flex items-center h-full">
                <article className="flex items-center px-4 h-full item-divider flex-shrink-0 cursor-pointer" style={{ width: '320px' }} onClick={() => handleTagClick('Biryani')}>
                  <div className="w-[84px] h-[78px] flex-shrink-0 flex items-center justify-center mr-3">
                    <img
                      alt=""
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlt-GPML9IDb7t0dgQGs7eipLliajlQXkb_OWHOrOLBHGNm61w6CLWM4DG3auLAMP_krnuIDnn3OyD5S0vpEg-YeveqkeZKdJOPaeVsktUUVHlmyOueA0asm8ngwsDSZ_OIaXpvvF1kJW9b-yVoNizbZadjyvgAl97tN4fLPv-clCdfd1YlShQhTWfhDtejyxtcbEzq12WnRFkkaSNwQctbNLWlLDKAZiydv-vxoaN-zSXgZGOW2J8Cnl9Qkrm2IJREw"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] leading-tight font-bold text-gray-950 line-clamp-1">Mouth-Watering Biryani Pictures</h3>
                    <p className="text-[11.5px] leading-[1.3] text-gray-600 mt-1 line-clamp-2">Rich, aromatic and appetizing biryani visuals designed to sell the dish.</p>
                  </div>
                </article>

                <article className="flex items-center px-4 h-full item-divider flex-shrink-0 cursor-pointer" style={{ width: '320px' }} onClick={() => handleTagClick('Beverages')}>
                  <div className="w-[84px] h-[78px] flex-shrink-0 flex items-center justify-center mr-3">
                    <img
                      alt=""
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT3XQjszc8I6nO9wCY7pJ_zbzLYsH1Bqcpeibh9EKZsEh07RN5tSRglrXcmck--RqpgRd_l9wbQWE9iUTA6iLF240C_iW_KRwB3AzoRxSGpdZzPqPS7t4Tz0SXdFVVqMCeSl6yjwXYq2jm-Sz7Ibad-2XEvOT7gKqnf2HcDrgiwYq0rrdw67C0PvNBV_1j84pGexSwOXOLNbpmV3dA01diq0B9uVv8GnhkiILjZlj2Fs-UZCtbtzs47cidF-KBY1aPjQ"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] leading-tight font-bold text-gray-950 line-clamp-1">Refreshing Beverage Photography</h3>
                    <p className="text-[11.5px] leading-[1.3] text-gray-600 mt-1 line-clamp-2">Fresh, vibrant and premium drink visuals for menus and social media.</p>
                  </div>
                </article>

                <article className="flex items-center px-4 h-full item-divider flex-shrink-0 cursor-pointer" style={{ width: '320px' }} onClick={() => handleTagClick('Fast Food')}>
                  <div className="w-[84px] h-[78px] flex-shrink-0 flex items-center justify-center mr-3">
                    <img
                      alt=""
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhiIjt531ELW-ka9Y-0b7j_tbPiJDdgQZBaRISoM56n3hctxkPpgWeoAuW9t_7LmURCHr30cgS34CBsXWHpjtD_Vy0t6MZtx-8sDExObVm8GTNk2liQcHiVALPPC19xBAXvospt63HKL6ZTb4ds9o4Fey97CNfS0DAPbOEh161dLkHa17q5i5afUMf3x7tcmJSPGmLuZXqNuJLERYfuFGLasNlsHjMANCfDUMNGFTyxqSSIuIrtqd9OkQjBEkjZ5Or0w"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] leading-tight font-bold text-gray-950 line-clamp-1">Best Fast Food Pictures</h3>
                    <p className="text-[11.5px] leading-[1.3] text-gray-600 mt-1 line-clamp-2">Crispy, tempting and restaurant-ready food photography.</p>
                  </div>
                </article>

                <article className="flex items-center px-4 h-full item-divider flex-shrink-0 cursor-pointer" style={{ width: '320px' }} onClick={() => handleTagClick('Biryani')}>
                  <div className="w-[84px] h-[78px] flex-shrink-0 flex items-center justify-center mr-3">
                    <img
                      alt=""
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlt-GPML9IDb7t0dgQGs7eipLliajlQXkb_OWHOrOLBHGNm61w6CLWM4DG3auLAMP_krnuIDnn3OyD5S0vpEg-YeveqkeZKdJOPaeVsktUUVHlmyOueA0asm8ngwsDSZ_OIaXpvvF1kJW9b-yVoNizbZadjyvgAl97tN4fLPv-clCdfd1YlShQhTWfhDtejyxtcbEzq12WnRFkkaSNwQctbNLWlLDKAZiydv-vxoaN-zSXgZGOW2J8Cnl9Qkrm2IJREw"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] leading-tight font-bold text-gray-950 line-clamp-1">Mouth-Watering Biryani Pictures</h3>
                    <p className="text-[11.5px] leading-[1.3] text-gray-600 mt-1 line-clamp-2">Rich, aromatic and appetizing biryani visuals designed to sell the dish.</p>
                  </div>
                </article>

                <article className="flex items-center px-4 h-full item-divider flex-shrink-0 cursor-pointer" style={{ width: '320px' }} onClick={() => handleTagClick('Beverages')}>
                  <div className="w-[84px] h-[78px] flex-shrink-0 flex items-center justify-center mr-3">
                    <img
                      alt=""
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT3XQjszc8I6nO9wCY7pJ_zbzLYsH1Bqcpeibh9EKZsEh07RN5tSRglrXcmck--RqpgRd_l9wbQWE9iUTA6iLF240C_iW_KRwB3AzoRxSGpdZzPqPS7t4Tz0SXdFVVqMCeSl6yjwXYq2jm-Sz7Ibad-2XEvOT7gKqnf2HcDrgiwYq0rrdw67C0PvNBV_1j84pGexSwOXOLNbpmV3dA01diq0B9uVv8GnhkiILjZlj2Fs-UZCtbtzs47cidF-KBY1aPjQ"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] leading-tight font-bold text-gray-950 line-clamp-1">Refreshing Beverage Photography</h3>
                    <p className="text-[11.5px] leading-[1.3] text-gray-600 mt-1 line-clamp-2">Fresh, vibrant and premium drink visuals for menus and social media.</p>
                  </div>
                </article>

                <article className="flex items-center px-4 h-full item-divider flex-shrink-0 cursor-pointer" style={{ width: '320px' }} onClick={() => handleTagClick('Fast Food')}>
                  <div className="w-[84px] h-[78px] flex-shrink-0 flex items-center justify-center mr-3">
                    <img
                      alt=""
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhiIjt531ELW-ka9Y-0b7j_tbPiJDdgQZBaRISoM56n3hctxkPpgWeoAuW9t_7LmURCHr30cgS34CBsXWHpjtD_Vy0t6MZtx-8sDExObVm8GTNk2liQcHiVALPPC19xBAXvospt63HKL6ZTb4ds9o4Fey97CNfS0DAPbOEh161dLkHa17q5i5afUMf3x7tcmJSPGmLuZXqNuJLERYfuFGLasNlsHjMANCfDUMNGFTyxqSSIuIrtqd9OkQjBEkjZ5Or0w"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] leading-tight font-bold text-gray-950 line-clamp-1">Best Fast Food Pictures</h3>
                    <p className="text-[11.5px] leading-[1.3] text-gray-600 mt-1 line-clamp-2">Crispy, tempting and restaurant-ready food photography.</p>
                  </div>
                </article>
              </div>
            </div>
          </div>

          {/* Pause / Play Button */}
          <button
            aria-label="Pause or resume ticker scrolling"
            className="absolute top-0 right-0 bottom-0 w-[28px] bg-ticker-red flex items-center justify-center text-white hover:opacity-95 transition-opacity focus:outline-none z-20 cursor-pointer"
            id="pause-toggle-btn"
            type="button"
            onClick={() => setTickerPaused(!tickerPaused)}
          >
            {tickerPaused ? (
              <svg className="w-[16px] h-[16px] fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <span className="flex items-center justify-center space-x-[3px]">
                <span className="w-[3px] h-[16px] bg-white rounded-sm block"></span>
                <span className="w-[3px] h-[16px] bg-white rounded-sm block"></span>
              </span>
            )}
          </button>
        </div>
      </section>

      {/* 2. BLACK FOODBLIZ NAVIGATION HEADER (Home, About Us, Packages, Contact Us modal trigger, Faqs modal trigger) */}
      <header className="w-full bg-black text-white relative border-b border-red-700/80 shadow-md">
        {/* MOBILE HEADER (md:hidden): Clean 3-section layout [ Hamburger ] [ Centered Foodbliz Logo ] [ Cart ] [ LOG IN ] */}
        <div className="flex md:hidden items-center justify-between px-3 py-2.5 min-h-[64px] relative bg-black">
          {/* 1. Left: Hamburger Button */}
          <div className="w-9 flex items-center justify-start shrink-0">
            <button
              aria-label="Toggle Navigation Menu"
              className="p-1.5 text-white hover:text-red-500 focus:outline-none cursor-pointer transition-colors"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                <line x1="3" x2="21" y1="6" y2="6"></line>
                <line x1="3" x2="21" y1="12" y2="12"></line>
                <line x1="3" x2="21" y1="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* 2. Center: Foodbliz Logo */}
          <div className="flex-1 flex items-center justify-center px-1">
            <a
              className="block focus:outline-none cursor-pointer"
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setCurrentRoute('home');
                scrollToTop();
              }}
            >
              <img
                alt="Foodbliz Logo"
                referrerPolicy="no-referrer"
                className="h-[28px] xs:h-[32px] w-auto max-w-[125px] xs:max-w-[145px] object-contain mx-auto block"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF9T6i3uYGaVX2uSUU5cz1-iawLSqBVCA1Ysqzi0pZP_KS6JMQbKdYMBVMOFlKaxqc24cQsBBBrPl6d6wFTXgLhQUlBpDf03eIEdfbBvgpsAeeYl0-VUzx9JpV3T52m040DwHMp9UO8_yiCm2Bu8lIRcT_vJxW_YVe8P9INm5iXDCb7pF8ZVWMTMJg_Nc378TSs_7C3_FLE2iAFq_vwCO4wgUdCfOBxb-YSACmLrCxbTWIn-wQny3up3w_DLkmNorGMw"
              />
            </a>
          </div>

          {/* 3. Right: Cart & Log In Buttons */}
          <div className="flex items-center gap-1.5 xs:gap-2 shrink-0">
            <button
              aria-label="View Cart"
              className="text-[#E12535] hover:opacity-80 transition-opacity focus:outline-none flex items-center justify-center cursor-pointer relative p-1.5 shrink-0"
              id="header-cart-btn-mobile"
              type="button"
              onClick={() => setCartDrawerOpen(true)}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
              </svg>
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#E50914] text-[10px] font-black w-4 h-4 rounded-full border border-[#E50914] flex items-center justify-center shadow-xs">
                  {totalCartCount > 99 ? '99+' : totalCartCount}
                </span>
              )}
            </button>
            <a
              className="flex items-center gap-1 px-2.5 xs:px-3 py-1.5 rounded-full bg-white text-black font-extrabold text-[10.5px] xs:text-[11.5px] tracking-wide uppercase hover:bg-gray-100 transition-colors shadow-sm shrink-0 cursor-pointer"
              href="#login"
              id="header-login-btn-mobile"
              onClick={(e) => {
                e.preventDefault();
                setLoginModalOpen(true);
              }}
            >
              <span className="leading-none">LOG IN</span>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* DESKTOP / TABLET HEADER (hidden md:flex) - Exactly preserved */}
        <div className="hidden md:flex relative w-full px-4 sm:px-8 lg:px-12 py-3 sm:py-3.5 flex-col items-center justify-center bg-black min-h-[96px]">
          {/* Right-side controls (Cart & Log In) */}
          <div className="absolute right-4 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10 shrink-0">
            <button
              aria-label="View Cart"
              className="text-[#E12535] hover:opacity-80 transition-opacity focus:outline-none flex items-center justify-center cursor-pointer relative p-1.5 shrink-0"
              id="header-cart-btn"
              type="button"
              onClick={() => setCartDrawerOpen(true)}
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
              </svg>
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#E50914] text-[10px] font-black w-4 h-4 rounded-full border border-[#E50914] flex items-center justify-center shadow-xs">
                  {totalCartCount > 99 ? '99+' : totalCartCount}
                </span>
              )}
            </button>
            <a
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black font-extrabold text-[13px] tracking-wide uppercase hover:bg-gray-100 transition-colors shadow-sm shrink-0 cursor-pointer"
              href="#login"
              onClick={(e) => {
                e.preventDefault();
                setLoginModalOpen(true);
              }}
            >
              <span className="leading-none">LOG IN</span>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
            </a>
          </div>

          {/* Logo & Desktop Nav links */}
          <div className="flex flex-col items-center justify-center">
            <a
              className="block mx-auto mb-2 focus:outline-none cursor-pointer"
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setCurrentRoute('home');
                scrollToTop();
              }}
            >
              <img
                alt="Foodbliz Logo"
                referrerPolicy="no-referrer"
                className="h-[42px] w-auto object-contain mx-auto block"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF9T6i3uYGaVX2uSUU5cz1-iawLSqBVCA1Ysqzi0pZP_KS6JMQbKdYMBVMOFlKaxqc24cQsBBBrPl6d6wFTXgLhQUlBpDf03eIEdfbBvgpsAeeYl0-VUzx9JpV3T52m040DwHMp9UO8_yiCm2Bu8lIRcT_vJxW_YVe8P9INm5iXDCb7pF8ZVWMTMJg_Nc378TSs_7C3_FLE2iAFq_vwCO4wgUdCfOBxb-YSACmLrCxbTWIn-wQny3up3w_DLkmNorGMw"
              />
            </a>
            <nav className="block mt-1">
              <ul className="flex items-center justify-center gap-8 sm:gap-10 text-[14.5px] sm:text-[15px] font-semibold text-white tracking-normal">
                <li>
                  <a
                    className={`flex items-center gap-2 transition-colors cursor-pointer ${currentRoute === 'home' ? 'text-red-500 font-bold' : 'hover:text-red-500'}`}
                    href="#home"
                    onClick={() => {
                      setCurrentRoute('home');
                      scrollToTop();
                    }}
                  >
                    <svg className="w-[17px] h-[17px] stroke-current fill-none shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>Home</span>
                  </a>
                </li>
                <li>
                  <a
                    className={`flex items-center gap-2 transition-colors cursor-pointer ${currentRoute === 'about' ? 'text-red-500 font-bold' : 'hover:text-red-500'}`}
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentRoute('about');
                      window.location.hash = '#about';
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <svg className="w-[17px] h-[17px] stroke-current fill-none shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span>About Us</span>
                  </a>
                </li>
                <li>
                  <a
                    className={`flex items-center gap-2 transition-colors cursor-pointer ${currentRoute === 'packages' ? 'text-red-500 font-bold' : 'hover:text-red-500'}`}
                    href="#packages"
                    onClick={() => {
                      setCurrentRoute('packages');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <svg className="w-[17px] h-[17px] stroke-current fill-none shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="16.5" x2="7.5" y1="9.4" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>
                    <span>Packages</span>
                  </a>
                </li>
                <li>
                  <button
                    className="flex items-center gap-2 hover:text-red-500 transition-colors font-semibold cursor-pointer focus:outline-none"
                    type="button"
                    onClick={() => setContactModalOpen(true)}
                  >
                    <svg className="w-[17px] h-[17px] stroke-current fill-none shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>Contact Us</span>
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center gap-2 hover:text-red-500 transition-colors font-semibold cursor-pointer focus:outline-none"
                    type="button"
                    onClick={() => setFaqModalOpen(true)}
                  >
                    <svg className="w-[17px] h-[17px] stroke-current fill-none shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                    <span>Faqs</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile Collapsible Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-neutral-900 border-t border-gray-800 px-6 py-4 flex flex-col gap-3 text-center transition-all duration-300">
            <a
              className={`py-1.5 font-semibold text-sm transition-colors block border-b border-gray-800/60 ${currentRoute === 'home' ? 'text-red-500 font-bold' : 'text-white hover:text-red-500'}`}
              href="#home"
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentRoute('home');
                scrollToTop();
              }}
            >
              Home
            </a>
            <a
              className={`py-1.5 font-semibold text-sm transition-colors block border-b border-gray-800/60 ${currentRoute === 'about' ? 'text-red-500 font-bold' : 'text-white hover:text-red-500'}`}
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                setCurrentRoute('about');
                window.location.hash = '#about';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              About Us
            </a>
            <a
              className={`py-1.5 font-semibold text-sm transition-colors block border-b border-gray-800/60 ${currentRoute === 'packages' ? 'text-red-500 font-bold' : 'text-white hover:text-red-500'}`}
              href="#packages"
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentRoute('packages');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Packages
            </a>
            <button
              className="text-white hover:text-red-500 py-1.5 font-semibold text-sm transition-colors block w-full border-b border-gray-800/60 text-center cursor-pointer"
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setContactModalOpen(true);
              }}
            >
              Contact Us
            </button>
            <button
              className="text-white hover:text-red-500 py-1.5 font-semibold text-sm transition-colors block w-full text-center cursor-pointer"
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setFaqModalOpen(true);
              }}
            >
              Faqs
            </button>
          </div>
        )}
      </header>

      {currentRoute === 'packages' ? (
        <main className="w-full">
          {/* ================================================== */}
          {/* 1. TOP PRICING SECTION                             */}
          {/* ================================================== */}
          <section
            className="relative w-full overflow-hidden bg-cover bg-center text-white pt-8 sm:pt-12 md:pt-14 pb-10 sm:pb-12 md:pb-14 px-4 sm:px-8 lg:px-12 shadow-md border-b border-neutral-800"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1800&q=80')"
            }}
          >
            {/* Atmospheric dark sky overlay matching reference */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#060c18]/90 via-[#0b172a]/85 to-[#050811]/95 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-6xl xl:max-w-7xl mx-auto flex flex-col items-center text-center">
              {/* Heading */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-black text-white tracking-tight leading-tight max-w-3xl px-2">
                Foodbliz Packages: Professional Content That Makes Your Food Stand Out
              </h1>

              {/* Short supporting line */}
              <p className="text-xs sm:text-sm md:text-base text-gray-300 font-medium mt-2.5 max-w-2xl leading-relaxed px-2">
                Professional food photography, appetizing menu styling, and high-impact culinary content for your brand.
              </p>

              {/* Two-option selector structure: Standard vs Subscription */}
              <div className="flex justify-center mt-6 mb-7 sm:mb-8 md:mb-9">
                <div className="inline-flex p-1 bg-black/85 backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
                  <button
                    type="button"
                    onClick={() => setPackagesTab('standard')}
                    className={`px-5 sm:px-7 py-2 rounded-md text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer focus:outline-none ${
                      packagesTab === 'standard'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setPackagesTab('subscription')}
                    className={`px-5 sm:px-7 py-2 rounded-md text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer focus:outline-none ${
                      packagesTab === 'subscription'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Subscription
                  </button>
                </div>
              </div>

              {/* THREE PRICING CARDS - STRICTLY IN ONE HORIZONTAL ROW ACROSS DESKTOP, TABLET, MOBILE */}
              <div className="w-full overflow-x-auto no-scrollbar py-1">
                <div className="flex flex-row items-stretch justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 min-w-full">
                  {(packagesTab === 'standard' ? STANDARD_PACKAGES : SUBSCRIPTION_PACKAGES).map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`flex-1 min-w-[96px] max-w-[340px] md:max-w-[370px] lg:max-w-[390px] bg-white rounded-2xl sm:rounded-3xl shadow-xl flex flex-col justify-between items-center text-center p-3 sm:p-5 md:p-6 lg:p-7 transition-all duration-200 ${
                        pkg.isPopular
                          ? 'border-2 border-[#E50914] shadow-2xl relative'
                          : 'border border-gray-100 hover:shadow-2xl'
                      }`}
                    >
                      {/* Popular indicator */}
                      {pkg.isPopular && (
                        <div className="mb-0.5 sm:mb-1">
                          <span className="text-[7.5px] sm:text-[9.5px] font-black uppercase tracking-wider text-white bg-[#E50914] px-1.5 sm:px-2.5 py-0.5 rounded-full inline-block shadow-2xs whitespace-nowrap">
                            {packagesTab === 'standard' ? 'Most Popular' : 'Best Value'}
                          </span>
                        </div>
                      )}

                      {/* Package Name & Image count */}
                      <div className="w-full">
                        <p
                          className={`text-[8.5px] sm:text-[10px] md:text-xs font-black tracking-widest uppercase ${
                            pkg.isPopular ? 'text-[#E50914]' : 'text-gray-400'
                          }`}
                        >
                          {pkg.name}
                        </p>
                        <h3 className="text-[11px] sm:text-base md:text-lg font-black text-gray-900 leading-tight mt-0.5 sm:mt-1">
                          {pkg.items}
                        </h3>
                      </div>

                      {/* Big Price */}
                      <div className="my-2 sm:my-4 md:my-5 flex flex-col items-center">
                        <div className="flex items-baseline justify-center">
                          <span className="text-xs sm:text-lg md:text-2xl font-black text-gray-900 mr-0.5">₹</span>
                          <span className="text-lg sm:text-3xl md:text-4xl lg:text-[42px] font-black text-gray-900 tracking-tight leading-none">
                            {pkg.price}
                          </span>
                        </div>
                        {pkg.period && (
                          <span className="text-[8px] sm:text-xs text-gray-500 font-semibold mt-0.5">
                            {pkg.period}
                          </span>
                        )}
                      </div>

                      {/* Small CTA Button */}
                      <button
                        type="button"
                        onClick={() => handlePackageSelect(pkg.name, pkg.price, packagesTab)}
                        className={`w-full py-1.5 sm:py-2.5 px-1 sm:px-4 rounded-full text-[9px] sm:text-xs md:text-sm font-bold tracking-wide transition-all cursor-pointer focus:outline-none ${
                          pkg.isPopular
                            ? 'bg-[#E50914] hover:bg-[#c81e24] text-white shadow-sm'
                            : 'border border-gray-300 hover:border-black text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        {pkg.cta}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Taxes Notice */}
              <p className="text-center text-[10px] sm:text-xs text-gray-300/90 font-medium mt-6 sm:mt-8">
                Prices shown in Indian Rupees (INR). Taxes may apply.
              </p>
            </div>
          </section>

          {/* ================================================== */}
          {/* 2. FOR SMALL AND MEDIUM FOOD BUSINESSES            */}
          {/* ================================================== */}
          <section className="w-full bg-white py-8 sm:py-12 md:py-16 px-4 sm:px-8 lg:px-12 border-b border-gray-100">
            <div className="w-full max-w-6xl xl:max-w-7xl mx-auto grid grid-cols-2 gap-2.5 xs:gap-3.5 sm:gap-8 md:gap-12 lg:gap-16 items-center">
              {/* Left Column: Text & CTA */}
              <div className="flex flex-col items-start text-left justify-center my-auto">
                {/* Mobile Heading (< sm) */}
                <h2 className="block sm:hidden text-[11px] xs:text-[12.5px] font-black text-gray-900 tracking-tight leading-tight">
                  For Small & Medium Food Businesses
                </h2>
                {/* Desktop/Tablet Heading (>= sm) */}
                <h2 className="hidden sm:block text-2xl md:text-[32px] font-black text-gray-900 tracking-tight sm:leading-tight">
                  For Small and Medium Food Businesses
                </h2>

                {/* Mobile Short paragraph (< sm) */}
                <p className="block sm:hidden text-[8px] xs:text-[9px] text-gray-600 font-medium mt-1 leading-snug">
                  Professional food photography for restaurants, cafés, cloud kitchens and growing food brands.
                </p>
                {/* Desktop/Tablet Paragraph 1 (>= sm) */}
                <p className="hidden sm:block text-xs md:text-sm text-gray-600 font-medium sm:mt-3 md:mt-4 sm:leading-relaxed">
                  We've got your restaurant, café, cloud kitchen or food venture covered with photography protection and content packages that match your commercial needs.
                </p>

                {/* Mobile Secondary paragraph (< sm) */}
                <p className="block sm:hidden text-[7.5px] xs:text-[8.5px] text-gray-500 font-normal mt-0.5 xs:mt-1 leading-snug">
                  Get high-quality images ready for menus, delivery apps and social media.
                </p>
                {/* Desktop/Tablet Paragraph 2 (>= sm) */}
                <p className="hidden sm:block text-xs md:text-sm text-gray-500 font-normal sm:mt-2.5 sm:leading-relaxed">
                  Empower your entire menu with comprehensive rights to download, edit, securely access, and publish mouth-watering dish visuals across Swiggy, Zomato, Instagram, and printed menus with full business license.
                </p>

                {/* Explore Now Button */}
                <div className="mt-1.5 xs:mt-2 sm:mt-5 md:mt-7">
                  <button
                    type="button"
                    onClick={handleExploreNow}
                    className="inline-flex items-center justify-center px-2.5 py-1 xs:px-3.5 xs:py-1.5 sm:px-7 sm:py-3 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-[9px] xs:text-[10px] sm:text-xs md:text-sm tracking-wide transition-all shadow-sm cursor-pointer focus:outline-none"
                  >
                    Explore Now
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Composition matching reference */}
              <div className="relative w-full max-w-[160px] xs:max-w-[185px] sm:max-w-md mx-auto md:max-w-none pt-1 sm:pt-4 pb-1 sm:pb-4 flex items-center justify-center">
                {/* Main Visual */}
                <div className="relative w-full rounded-lg sm:rounded-2xl overflow-hidden shadow-sm sm:shadow-xl aspect-4/3 bg-gray-100 border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80"
                    alt="Culinary team preparing restaurant dishes"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>

                {/* Overlapping Top-Right Floating Food Photo */}
                <div className="absolute -top-1 -right-1 sm:-top-4 sm:-right-4 w-12 xs:w-14 sm:w-36 md:w-40 rounded-md sm:rounded-xl overflow-hidden shadow-md sm:shadow-2xl border sm:border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
                    alt="Artisan food close-up styling"
                    className="w-full aspect-4/3 object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Overlapping Bottom-Left Floating Audio/Media Badge */}
                <div className="absolute -bottom-1 -left-1 sm:-bottom-3 sm:-left-3 bg-black/90 backdrop-blur-md text-white border border-white/20 rounded-md sm:rounded-xl px-1.5 py-0.5 sm:px-3.5 sm:py-2 shadow-md sm:shadow-2xl flex items-center gap-1 sm:gap-2.5">
                  <div className="flex items-center gap-0.5 h-2.5 sm:h-4">
                    <span className="w-0.5 sm:w-1 h-1 sm:h-2 bg-[#E50914] rounded-full animate-pulse"></span>
                    <span className="w-0.5 sm:w-1 h-2 sm:h-3.5 bg-white rounded-full"></span>
                    <span className="w-0.5 sm:w-1 h-1.5 sm:h-2.5 bg-[#E50914] rounded-full"></span>
                    <span className="w-0.5 sm:w-1 h-2.5 sm:h-4 bg-white rounded-full"></span>
                    <span className="w-0.5 sm:w-1 h-1 sm:h-2 bg-white rounded-full"></span>
                  </div>
                  <div className="text-left">
                    <p className="text-[6.5px] sm:text-[9px] font-black tracking-wider uppercase text-gray-300 leading-none">Studio Grade</p>
                    <p className="text-[7.5px] sm:text-[11px] font-bold text-white leading-tight">Video & Stills</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================== */}
          {/* 3. FAQ + CONTACT US SECTION                         */}
          {/* ================================================== */}
          <section className="w-full bg-white py-8 sm:py-12 md:py-16 px-4 sm:px-8 lg:px-12">
            <div className="w-full max-w-6xl xl:max-w-7xl mx-auto">
              <h2 className="text-base sm:text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight mb-4 sm:mb-8 text-left">
                Have Questions? We're Here to Help.
              </h2>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-6 md:gap-8">
                {/* Box 1: FAQs */}
                <div className="border border-gray-200 rounded-xl bg-white p-3 sm:p-6 md:p-8 lg:p-10 flex flex-col items-center text-center justify-between shadow-2xs hover:shadow-xs transition-shadow min-h-[190px] sm:min-h-[220px] md:min-h-[240px]">
                  <div className="flex flex-col items-center">
                    {/* Question icon in circle matching reference */}
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 border-gray-900 flex items-center justify-center text-gray-900 font-bold text-base sm:text-xl mb-2 sm:mb-3.5">
                      ?
                    </div>
                    <h3 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-1.5">
                      FAQs
                    </h3>
                    <p className="text-[9.5px] sm:text-xs md:text-sm text-gray-500 max-w-xs sm:max-w-sm leading-normal sm:leading-relaxed font-normal">
                      Find answers about Foodbliz packages, photography services and content plans.
                    </p>
                  </div>

                  <div className="w-full pt-3 sm:pt-5">
                    <button
                      type="button"
                      onClick={() => setFaqModalOpen(true)}
                      className="w-full max-w-[280px] sm:max-w-[320px] mx-auto py-2 px-2 sm:py-2.5 sm:px-6 rounded-full border border-gray-300 hover:border-black text-gray-800 font-semibold text-[10.5px] sm:text-xs md:text-sm transition-colors cursor-pointer focus:outline-none block"
                    >
                      View FAQs
                    </button>
                  </div>
                </div>

                {/* Box 2: Contact Us */}
                <div className="border border-gray-200 rounded-xl bg-white p-3 sm:p-6 md:p-8 lg:p-10 flex flex-col items-center text-center justify-between shadow-2xs hover:shadow-xs transition-shadow min-h-[190px] sm:min-h-[220px] md:min-h-[240px]">
                  <div className="flex flex-col items-center">
                    {/* Mail icon matching reference */}
                    <div className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center text-gray-900 mb-2 sm:mb-3.5">
                      <svg className="w-7 h-7 sm:w-9 sm:h-9 stroke-current fill-none stroke-[1.8]" viewBox="0 0 24 24">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <h3 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-1.5">
                      Contact Us
                    </h3>
                    <p className="text-[9.5px] sm:text-xs md:text-sm text-gray-500 max-w-xs sm:max-w-sm leading-normal sm:leading-relaxed font-normal">
                      Need help choosing the right Foodbliz package? We're happy to help.
                    </p>
                  </div>

                  <div className="w-full pt-3 sm:pt-5">
                    <button
                      type="button"
                      onClick={() => setContactModalOpen(true)}
                      className="w-full max-w-[280px] sm:max-w-[320px] mx-auto py-2 px-2 sm:py-2.5 sm:px-6 rounded-full border border-gray-300 hover:border-black text-gray-800 font-semibold text-[10.5px] sm:text-xs md:text-sm transition-colors cursor-pointer focus:outline-none block"
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : currentRoute === 'about' ? (
        <main className="w-full">
          {/* ================================================== */}
          {/* ABOUT US PAGE — STRUCTURALLY MATCHING REFERENCE    */}
          {/* ================================================== */}
          {/* Full-Width Search Bar Section immediately below navigation */}
          <section className="w-full bg-white border-b border-gray-200 py-2 sm:py-2.5 px-3 sm:px-6 lg:px-8">
            <div className="w-full flex items-center gap-1.5 xs:gap-2 sm:gap-3 relative z-30">
              {/* Photos Selector Box */}
              <div className="relative shrink-0" id="search-type-dropdown" ref={mediaDropdownRef}>
                <button
                  aria-expanded={mediaDropdownOpen}
                  aria-haspopup="listbox"
                  className="h-11 xs:h-12 sm:h-[48px] bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 px-2.5 xs:px-4 flex items-center gap-1.5 xs:gap-2 text-gray-800 text-xs xs:text-sm font-semibold transition-colors focus:outline-none cursor-pointer shrink-0"
                  id="hero-media-dropdown-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMediaDropdownOpen(!mediaDropdownOpen);
                  }}
                >
                  <span className="flex items-center gap-1.5 xs:gap-2">
                    <span className="flex items-center" id="search-dropdown-icon">
                      {selectedMediaType === 'Photos' && (
                        <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      )}
                      {(selectedMediaType === 'Videos' || selectedMediaType === 'Video') && (
                        <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polygon points="23 7 16 12 23 17 23 7"></polygon>
                          <rect height="14" rx="2" ry="2" width="15" x="1" y="5"></rect>
                        </svg>
                      )}
                      {(selectedMediaType === 'Banners' || selectedMediaType === 'Banner') && (
                        <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect height="16" rx="2" width="20" x="2" y="4"></rect>
                          <line x1="2" x2="22" y1="10" y2="10"></line>
                        </svg>
                      )}
                      {(selectedMediaType === 'Templates' || selectedMediaType === 'Template') && (
                        <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect height="18" rx="2" width="18" x="3" y="3"></rect>
                          <line x1="3" x2="21" y1="9" y2="9"></line>
                          <line x1="9" x2="9" y1="21" y2="9"></line>
                        </svg>
                      )}
                    </span>
                    <span>{selectedMediaType}</span>
                  </span>
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {/* Dropdown Menu - all four options restored */}
                {mediaDropdownOpen && (
                  <div
                    aria-label="Media selection dropdown"
                    role="listbox"
                    className="absolute left-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-gray-200 py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                  >
                    {(['Photos', 'Videos', 'Banners', 'Templates'] as const).map((type) => (
                      <div
                        key={type}
                        role="option"
                        aria-selected={selectedMediaType === type}
                        tabIndex={0}
                        className={`w-full px-4 py-2 text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                          selectedMediaType === type ? 'bg-red-50 text-[#E50914]' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setSelectedMediaType(type);
                          setMediaDropdownOpen(false);
                        }}
                      >
                        <span>{type}</span>
                        {selectedMediaType === type && (
                          <svg className="w-3.5 h-3.5 text-[#E50914]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Bar Input Container extending across full remaining width */}
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setCurrentRoute('home');
                      window.location.hash = '#home';
                      setTimeout(() => scrollToDishes(), 100);
                    }
                  }}
                  placeholder="Search for photos, dishes, cuisines..."
                  className="w-full h-11 xs:h-12 sm:h-[48px] bg-white rounded-xl shadow-sm border border-gray-200 pl-3.5 xs:pl-4 pr-11 xs:pr-12 text-xs xs:text-sm text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:border-red-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCurrentRoute('home');
                    window.location.hash = '#home';
                    setTimeout(() => scrollToDishes(), 100);
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 xs:h-9 xs:w-9 sm:h-[38px] sm:w-[38px] rounded-lg bg-[#E50914] hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer focus:outline-none"
                  aria-label="Search"
                >
                  <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* Breadcrumb immediately below search section */}
          <div className="w-full px-4 sm:px-8 lg:px-12 pt-2.5 pb-2.5 flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
            <button
              onClick={() => {
                setCurrentRoute('home');
                window.location.hash = '#home';
              }}
              className="hover:text-[#E50914] transition-colors cursor-pointer font-medium"
            >
              Home
            </button>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-900 font-medium">About Us</span>
          </div>

          {/* About Us Hero Section matching reference */}
          <section className="relative w-full bg-cover bg-center flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 shadow-md py-10 sm:py-14 md:py-16 min-h-[300px] sm:min-h-[350px] md:min-h-[380px] text-white overflow-hidden border-b border-gray-200"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1600&q=80')"
            }}
          >
            <div className="absolute inset-0 bg-black/55 pointer-events-none"></div>
            <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl mx-auto flex flex-col items-center text-center px-4">
              <span className="text-[#E50914] text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">ABOUT FOODBLIZ</span>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight text-white mb-3 max-w-3xl leading-tight">
                Powering Food Brands with Professional Visuals
              </h1>
              <p className="text-gray-200 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                We create professional food photography and visual content that helps restaurants, cafés, cloud kitchens and food brands stand out.
              </p>
            </div>
          </section>

          {/* THREE FEATURE CARDS SECTION */}
          <section className="w-full bg-white py-8 sm:py-14 md:py-16 px-2 min-[360px]:px-3 sm:px-8 lg:px-12">
            <div className="w-full max-w-6xl xl:max-w-7xl mx-auto">
              <div className="text-center mb-6 sm:mb-10">
                <h2 className="text-[11.5px] min-[320px]:text-[13px] min-[360px]:text-[14px] min-[390px]:text-[15.5px] min-[430px]:text-[17px] sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight sm:tracking-tight whitespace-nowrap sm:whitespace-normal">
                  Why Leading Food Brands Choose Foodbliz
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-1.5 sm:mt-2 max-w-xl mx-auto">
                  Built specifically for restaurants, cloud kitchens, and culinary entrepreneurs who demand high visual impact.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 xs:gap-2.5 sm:gap-6 lg:gap-8">
                {/* Card 1 */}
                <div className="border border-gray-200 rounded-xl sm:rounded-2xl bg-white p-2 xs:p-3 sm:p-6 lg:p-8 shadow-2xs sm:shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center h-full">
                  <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-red-50 text-[#E50914] flex items-center justify-center font-bold text-xs xs:text-sm sm:text-xl mb-1.5 xs:mb-2 sm:mb-4 shrink-0">
                    📸
                  </div>
                  <h3 className="text-[10px] min-[360px]:text-[11px] sm:text-lg font-bold text-gray-900 leading-tight mb-1 sm:mb-2">
                    Studio-Grade Stills
                  </h3>
                  <p className="text-[8px] min-[360px]:text-[8.5px] min-[400px]:text-[9.5px] sm:text-sm text-gray-600 leading-snug sm:leading-relaxed">
                    Professional lighting, expert food styling, and high-resolution captures that make every dish look irresistible on any screen.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="border border-gray-200 rounded-xl sm:rounded-2xl bg-white p-2 xs:p-3 sm:p-6 lg:p-8 shadow-2xs sm:shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center h-full">
                  <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-red-50 text-[#E50914] flex items-center justify-center font-bold text-xs xs:text-sm sm:text-xl mb-1.5 xs:mb-2 sm:mb-4 shrink-0">
                    🚀
                  </div>
                  <h3 className="text-[10px] min-[360px]:text-[11px] sm:text-lg font-bold text-gray-900 leading-tight mb-1 sm:mb-2">
                    Delivery App Ready
                  </h3>
                  <p className="text-[8px] min-[360px]:text-[8.5px] min-[400px]:text-[9.5px] sm:text-sm text-gray-600 leading-snug sm:leading-relaxed">
                    Tailored aspect ratios and color grading optimized for Swiggy, Zomato, UberEats, DoorDash, and social media feeds.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="border border-gray-200 rounded-xl sm:rounded-2xl bg-white p-2 xs:p-3 sm:p-6 lg:p-8 shadow-2xs sm:shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center h-full">
                  <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-red-50 text-[#E50914] flex items-center justify-center font-bold text-xs xs:text-sm sm:text-xl mb-1.5 xs:mb-2 sm:mb-4 shrink-0">
                    ⚡
                  </div>
                  <h3 className="text-[10px] min-[360px]:text-[11px] sm:text-lg font-bold text-gray-900 leading-tight mb-1 sm:mb-2">
                    Fast 24H Turnaround
                  </h3>
                  <p className="text-[8px] min-[360px]:text-[8.5px] min-[400px]:text-[9.5px] sm:text-sm text-gray-600 leading-snug sm:leading-relaxed">
                    Quick delivery of edited high-definition photos and videos so your new seasonal menu launches right on schedule.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* GROWTH STATISTICS SECTION */}
          <GrowthStatsSection />

          {/* TESTIMONIALS SECTION */}
          <TestimonialsSection />
        </main>
      ) : (
        <main className="w-full">
          {/* 3. CLEAN HERO SECTION */}
          <section
        id="about"
        className="relative w-full bg-cover bg-center flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 shadow-md py-6 sm:py-10 md:py-12 lg:py-14 min-h-[320px] sm:min-h-[380px] md:min-h-[420px]"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida/AEtjO1Utm3-QqN4AzFKA83VSwmUf9vVfSTlphOzog1GWJDpoKnlSuLaAS3JsmPWSw2iw_Z27W7IKoaGl_wujvgdvHLUrcwCr1HGAKJ1lKZb6hQO0a7f2PSqsFQIGtcQcLuli3lmdC28yTmkUIjZADBH7W0HZ3O8e7UKedAJBUcaox81gJrizjkmQBZGbHQMZVlhtuJyD5tRDOr5etUpvyf9HMFLu1l2td7wLxQl7zrtjxbwN-UwILTYbJOmfcuw')"
        }}
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-stone-50/70 to-transparent"></div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 68% 68% at center, rgba(248, 246, 242, 0.88) 0%, rgba(248, 246, 242, 0.65) 55%, rgba(248, 246, 242, 0) 80%)'
          }}
        ></div>

        <div className="relative z-10 w-full max-w-6xl xl:max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="hero-headline text-[18px] xs:text-[21px] sm:text-3xl md:text-5xl lg:text-[54px] font-black text-gray-900 tracking-tight text-center leading-tight max-w-full px-2">
            {/* Mobile (strictly TWO lines as requested) */}
            <span className="sm:hidden block">
              <span className="block leading-tight">Professional <span className="text-[#e2242b]">Food Visuals</span></span>
              <span className="block leading-tight text-[15px] min-[360px]:text-[17px] min-[400px]:text-[19px] whitespace-nowrap">That Make Your Food Irresistible</span>
            </span>
            {/* Desktop / Tablet */}
            <span className="hidden sm:inline">
              Professional <span className="text-[#e2242b]">Food Visuals</span>
              <br className="hidden sm:inline" /> That Make Your Food Irresistible
            </span>
          </h1>
          <p className="text-gray-700 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-medium text-center mt-2 sm:mt-3 max-w-3xl lg:max-w-4xl mx-auto px-2">
            High-quality food photos for restaurants, menus, delivery apps and social media.
          </p>

          {/* Category Tabs Navigation - Scaled and spaced naturally across desktop width */}
          <div className="w-full max-w-5xl lg:max-w-6xl mx-auto flex items-center justify-start sm:justify-center overflow-x-auto touch-pan-x pb-2 pt-1 gap-4 sm:gap-8 md:gap-11 lg:gap-14 xl:gap-16 text-neutral-800 scrollbar-none select-none mt-3.5 sm:mt-4 md:mt-5 mb-3.5 sm:mb-5 md:mb-6 hero-category-nav-wrap px-2 sm:px-4 flex-nowrap" id="hero-category-nav">
            <button
              className={`hero-category-btn flex flex-col items-center group cursor-pointer focus:outline-none px-1 sm:px-2 md:px-3 pb-1.5 sm:pb-2.5 font-medium border-b-2 transition-colors shrink-0 ${
                activeCategory === 'dish-photos' ? 'text-[#e2242b] border-[#e2242b] font-bold' : 'text-neutral-800 border-transparent hover:text-[#e2242b]'
              }`}
              type="button"
              onClick={() => {
                setActiveCategory('dish-photos');
                setSearchQuery('');
              }}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6.5 lg:h-6.5 mb-1 sm:mb-1.5 md:mb-2 stroke-current fill-none stroke-[2.2]" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8Z"></path>
                <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"></path>
                <path d="m2.1 21.9 6.4-6.4"></path>
                <path d="m19 5-7 7"></path>
              </svg>
              <span className="text-[11px] sm:text-[13px] md:text-sm lg:text-[15px] whitespace-nowrap">
                <span className="sm:hidden">Photos</span>
                <span className="hidden sm:inline">Dish Photos</span>
              </span>
            </button>

            <button
              className={`hero-category-btn flex flex-col items-center group cursor-pointer focus:outline-none px-1 sm:px-2 md:px-3 pb-1.5 sm:pb-2.5 font-medium border-b-2 transition-colors shrink-0 ${
                activeCategory === 'beverages' ? 'text-[#e2242b] border-[#e2242b] font-bold' : 'text-neutral-800 border-transparent hover:text-[#e2242b]'
              }`}
              type="button"
              onClick={() => {
                setActiveCategory('beverages');
                handleTagClick('Beverages');
              }}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6.5 lg:h-6.5 mb-1 sm:mb-1.5 md:mb-2 stroke-current fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                <line x1="6" x2="6" y1="2" y2="4"></line>
                <line x1="10" x2="10" y1="2" y2="4"></line>
                <line x1="14" x2="14" y1="2" y2="4"></line>
              </svg>
              <span className="text-[11px] sm:text-[13px] md:text-sm lg:text-[15px] whitespace-nowrap">Beverages</span>
            </button>

            <button
              className={`hero-category-btn flex flex-col items-center group cursor-pointer focus:outline-none px-1 sm:px-2 md:px-3 pb-1.5 sm:pb-2.5 font-medium border-b-2 transition-colors shrink-0 ${
                activeCategory === 'food-menus' ? 'text-[#e2242b] border-[#e2242b] font-bold' : 'text-neutral-800 border-transparent hover:text-[#e2242b]'
              }`}
              type="button"
              onClick={() => {
                setActiveCategory('food-menus');
                setSearchQuery('');
              }}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6.5 lg:h-6.5 mb-1 sm:mb-1.5 md:mb-2 stroke-current fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 4v3"></path>
                <path d="M4 18h16a1 1 0 0 0 1-1A9 9 0 0 0 3 17a1 1 0 0 0 1 1Z"></path>
                <path d="M2 20h20"></path>
              </svg>
              <span className="text-[11px] sm:text-[13px] md:text-sm lg:text-[15px] whitespace-nowrap">Food Menus</span>
            </button>

            <button
              className={`hero-category-btn flex flex-col items-center group cursor-pointer focus:outline-none px-1 sm:px-2 md:px-3 pb-1.5 sm:pb-2.5 font-medium border-b-2 transition-colors shrink-0 ${
                activeCategory === 'chef-specials' ? 'text-[#e2242b] border-[#e2242b] font-bold' : 'text-neutral-800 border-transparent hover:text-[#e2242b]'
              }`}
              type="button"
              onClick={() => {
                setActiveCategory('chef-specials');
                handleTagClick('North Indian');
              }}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6.5 lg:h-6.5 mb-1 sm:mb-1.5 md:mb-2 stroke-current fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M6 18h12v3H6z"></path>
                <path d="M6 14a4 4 0 0 1-2-7.5A4 4 0 0 1 12 5a4 4 0 0 1 8 1.5A4 4 0 0 1 18 14Z"></path>
              </svg>
              <span className="text-[11px] sm:text-[13px] md:text-sm lg:text-[15px] whitespace-nowrap">Chef Specials</span>
            </button>

            <button
              className={`hero-category-btn flex flex-col items-center group cursor-pointer focus:outline-none px-1 sm:px-2 md:px-3 pb-1.5 sm:pb-2.5 font-medium border-b-2 transition-colors shrink-0 ${
                activeCategory === 'desserts' ? 'text-[#e2242b] border-[#e2242b] font-bold' : 'text-neutral-800 border-transparent hover:text-[#e2242b]'
              }`}
              type="button"
              onClick={() => {
                setActiveCategory('desserts');
                handleTagClick('Desserts');
              }}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6.5 lg:h-6.5 mb-1 sm:mb-1.5 md:mb-2 stroke-current fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h-2V5.73A2 2 0 0 1 12 2Z"></path>
                <path d="M4 11a8 8 0 0 1 16 0H4Z"></path>
                <path d="m5 11 1.5 9h11l1.5-9"></path>
              </svg>
              <span className="text-[11px] sm:text-[13px] md:text-sm lg:text-[15px] whitespace-nowrap">Desserts</span>
            </button>

            {/* 6th Category: Pizza & Burgers - Accessible on both mobile and desktop/tablet via horizontal scroll */}
            <button
              className={`hero-category-btn flex flex-col items-center group cursor-pointer focus:outline-none px-1 sm:px-2 md:px-3 pb-1.5 sm:pb-2.5 font-medium border-b-2 transition-colors shrink-0 ${
                activeCategory === 'pizza-burgers' ? 'text-[#e2242b] border-[#e2242b] font-bold' : 'text-neutral-800 border-transparent hover:text-[#e2242b]'
              }`}
              type="button"
              onClick={() => {
                setActiveCategory('pizza-burgers');
                handleTagClick('Pizza');
              }}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6.5 lg:h-6.5 mb-1 sm:mb-1.5 md:mb-2 stroke-current fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="m12 2 9 17H3L12 2Z"></path>
                <circle cx="12" cy="12" r="1.5"></circle>
                <circle cx="9" cy="15" r="1"></circle>
                <circle cx="14" cy="16" r="1"></circle>
              </svg>
              <span className="text-[11px] sm:text-[13px] md:text-sm lg:text-[15px] whitespace-nowrap">Pizza &amp; Burgers</span>
            </button>
          </div>

          {/* Search Bar & Trending Wrapper: Photos dropdown on left, search bar & trending row stacked on right */}
          <div className="w-full mx-auto max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
            <div className="w-full flex items-start gap-1.5 xs:gap-2 md:gap-2.5 relative z-30" id="hero-search-container">
              {/* Photos Selector Box (Left Column) */}
              <div className="relative shrink-0" id="search-type-dropdown" ref={mediaDropdownRef}>
                <button
                  aria-expanded={mediaDropdownOpen}
                  aria-haspopup="listbox"
                  className="h-11 xs:h-12 sm:h-[50px] md:h-[54px] bg-white rounded-xl shadow-lg shadow-black/10 border border-gray-200 hover:bg-gray-50 px-2.5 xs:px-4 md:px-5 flex items-center gap-1.5 xs:gap-2 md:gap-2.5 text-gray-800 text-xs xs:text-sm md:text-base font-semibold transition-colors focus:outline-none cursor-pointer shrink-0"
                  id="hero-media-dropdown-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMediaDropdownOpen(!mediaDropdownOpen);
                  }}
                >
                  <span className="flex items-center gap-1.5 xs:gap-2">
                    <span className="flex items-center" id="search-dropdown-icon">
                      {selectedMediaType === 'Photos' && (
                        <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      )}
                      {(selectedMediaType === 'Videos' || selectedMediaType === 'Video') && (
                        <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polygon points="23 7 16 12 23 17 23 7"></polygon>
                          <rect height="14" rx="2" ry="2" width="15" x="1" y="5"></rect>
                        </svg>
                      )}
                      {(selectedMediaType === 'Banners' || selectedMediaType === 'Banner') && (
                        <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect height="16" rx="2" width="20" x="2" y="4"></rect>
                          <line x1="2" x2="22" y1="10" y2="10"></line>
                        </svg>
                      )}
                      {(selectedMediaType === 'Templates' || selectedMediaType === 'Template') && (
                        <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect height="18" rx="2" width="18" x="3" y="3"></rect>
                          <line x1="3" x2="21" y1="9" y2="9"></line>
                          <line x1="9" x2="9" y1="21" y2="9"></line>
                        </svg>
                      )}
                    </span>
                    <span id="search-dropdown-selected-label">{selectedMediaType}</span>
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${mediaDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    id="search-dropdown-arrow"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>

                {/* Compact, elegant Foodbliz style dropdown matching button width */}
                {mediaDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-[100]" id="search-dropdown-menu" role="listbox">
                    {(['Photos', 'Videos', 'Banners', 'Templates'] as const).map((type) => (
                      <button
                        key={type}
                        className={`search-dropdown-item w-full px-3 py-2 text-left text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                          selectedMediaType === type ? 'text-[#e2242b] font-semibold bg-red-50/60' : 'text-gray-800 hover:bg-gray-50 hover:text-[#e2242b]'
                        }`}
                        type="button"
                        onClick={() => {
                          setSelectedMediaType(type);
                          setMediaDropdownOpen(false);
                        }}
                      >
                        <span className="truncate">{type}</span>
                        {selectedMediaType === type && (
                          <svg className="w-3.5 h-3.5 text-[#e2242b] shrink-0 ml-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Search Bar & Trending Row */}
              <div className="flex-1 min-w-0 flex flex-col">
                {/* Search Input & Button Box */}
                <div className="h-11 xs:h-12 sm:h-[50px] md:h-[54px] w-full bg-white rounded-xl shadow-lg shadow-black/10 flex items-center border border-gray-200 overflow-hidden pl-2.5 xs:pl-4 md:pl-5 pr-1 sm:pr-1.5 md:pr-2">
                  <input
                    ref={searchInputRef}
                    className="w-full h-full py-0 text-xs xs:text-sm md:text-base text-gray-800 placeholder-neutral-400 bg-transparent border-0 focus:outline-none focus:ring-0 min-w-0"
                    placeholder="Search for photos"
                    type="text"
                    id="main-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && dishesGridRef.current) {
                        dishesGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  />
                  <button
                    aria-label="Search"
                    className="h-[34px] w-[34px] xs:h-[38px] xs:w-[38px] sm:h-10 sm:w-10 md:h-[42px] md:w-[42px] bg-[#e2242b] hover:bg-[#c81e24] text-white rounded-lg flex items-center justify-center transition-colors focus:outline-none cursor-pointer shrink-0"
                    type="button"
                    onClick={() => {
                      if (dishesGridRef.current) {
                        dishesGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 stroke-current fill-none stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </div>

                {/* Trending Keywords Row - Positioned immediately below search bar with 2-3px gap */}
                <div className="w-full mt-0.5 sm:mt-1 pl-2.5 xs:pl-4 md:pl-5 pr-[42px] xs:pr-[46px] sm:pr-12 md:pr-14 overflow-hidden">
                  <div
                    className="w-full flex flex-nowrap items-center gap-x-2 overflow-hidden whitespace-nowrap text-ellipsis"
                    id="hero-trending-row"
                  >
                    <span className="font-bold text-gray-900 text-xs sm:text-[13px] leading-normal shrink-0 select-none mr-1">
                      Trending:
                    </span>
                    {(['burger', 'pizza', 'biryani', 'coffee', 'desserts', 'noodles', 'pasta', 'wrap', 'sandwich', 'thali', 'momos', 'dosa', 'paneer', 'kebab', 'ice cream', 'Chinese', 'South Indian', 'North Indian'] as const).map((tag, idx, arr) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className="p-0 m-0 bg-transparent border-0 inline-flex items-center text-xs sm:text-[13px] font-normal text-gray-700 hover:text-[#e2242b] leading-normal transition-colors cursor-pointer shrink-0 whitespace-nowrap focus:outline-none"
                      >
                        {tag}{idx < arr.length - 1 ? ',' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BANNER CAROUSEL SECTION */}
      <section aria-label="Featured Photography Banners" className="w-full bg-white py-6 px-4 sm:px-8 lg:px-12">
        <div className="w-full mx-auto">
          <div className="relative w-full overflow-hidden rounded-xl" id="banner-carousel-container">
            <div
              className="flex transition-transform duration-700 ease-in-out w-full"
              id="carousel-track"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {CAROUSEL_BANNERS.map((banner, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <a
                    className="block w-full overflow-hidden rounded-xl cursor-pointer"
                    href="#packages"
                    onClick={() => {
                      setCurrentRoute('packages');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <img
                      alt={banner.alt}
                      referrerPolicy="no-referrer"
                      className="w-full aspect-[1718/432] object-cover block rounded-xl"
                      src={banner.img}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </a>
                </div>
              ))}
            </div>

            {/* Carousel Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex justify-center items-center gap-2 pointer-events-auto" id="carousel-dots">
              {CAROUSEL_BANNERS.map((_, index) => (
                <button
                  key={index}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`carousel-dot w-2 h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none shadow-sm ${
                    carouselIndex === index ? 'bg-[#E50914] scale-125' : 'bg-white/70 hover:bg-white'
                  }`}
                  type="button"
                  onClick={() => setCarouselIndex(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. EXPLORE POPULAR CUISINES SECTION */}
      <section className="w-full bg-white py-8 sm:py-10 md:py-12 px-4 sm:px-8 lg:px-12 relative select-none border-b border-gray-100">
        <div className="w-full mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-6 md:mb-8">
          <div className="w-full flex items-center justify-center gap-4 max-w-3xl lg:max-w-4xl mx-auto">
            <div className="flex-1 h-[2px] bg-[#E50914]"></div>
            <h2 className="text-xl sm:text-2xl md:text-[28px] lg:text-[30px] font-black tracking-tight uppercase whitespace-nowrap text-[#111827]">
              EXPLORE <span className="text-[#E50914]">POPULAR CUISINES</span>
            </h2>
            <div className="flex-1 h-[2px] bg-[#E50914]"></div>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base font-medium mt-1.5">
            Find the perfect food category for your menu, delivery app or social media.
          </p>
        </div>

        <div className="relative w-full px-2 sm:px-4">
          <button
            aria-label="Previous cuisines"
            className="absolute -left-2 sm:-left-3 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 hover:shadow-lg transition-all focus:outline-none cursor-pointer"
            id="cuisine-prev"
            type="button"
            onClick={() => scrollCuisine('left')}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          <button
            aria-label="Next cuisines"
            className="absolute -right-2 sm:-right-3 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 hover:shadow-lg transition-all focus:outline-none cursor-pointer"
            id="cuisine-next"
            type="button"
            onClick={() => scrollCuisine('right')}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>

          <div
            ref={cuisineContainerRef}
            className="overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-none py-1 no-scrollbar lg:overflow-visible"
            id="cuisine-scroll-container"
          >
            <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4 py-2 select-none w-max lg:w-full">
              {/* Row 1 */}
              <div className="w-max lg:w-full flex lg:grid lg:grid-cols-8 items-start gap-1.5 sm:gap-2.5 md:gap-3.5 lg:gap-3 xl:gap-4">
                {CUISINES_ROW_1.map((item, idx) => (
                  <div
                    key={idx}
                    className="cuisine-card group flex flex-col items-center justify-center cursor-pointer flex-shrink-0 lg:flex-shrink w-[148px] sm:w-[162px] md:w-[185px] lg:w-full py-1 transition-transform duration-200 hover:-translate-y-0.5"
                    onClick={() => handleTagClick(item.name)}
                  >
                    <img
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className={`w-[148px] h-[110px] sm:w-[162px] sm:h-[120px] md:w-[180px] md:h-[130px] lg:w-full lg:h-[130px] xl:h-[150px] object-contain mx-auto transition-transform duration-300 group-hover:scale-105 ${
                        item.name === 'Ice Cream' ? 'translate-y-2 sm:translate-y-2.5' : ''
                      }`}
                      src={item.img}
                    />
                    <span className="font-bold text-gray-900 text-[15px] sm:text-[16px] md:text-[17px] lg:text-[16px] xl:text-[18px] text-center block" style={{ marginTop: '-8px' }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Row 2 */}
              <div className="w-max lg:w-full flex lg:grid lg:grid-cols-8 items-start gap-1.5 sm:gap-2.5 md:gap-3.5 lg:gap-3 xl:gap-4">
                {CUISINES_ROW_2.map((item, idx) => (
                  <div
                    key={idx}
                    className="cuisine-card group flex flex-col items-center justify-center cursor-pointer flex-shrink-0 lg:flex-shrink w-[148px] sm:w-[162px] md:w-[185px] lg:w-full py-1 transition-transform duration-200 hover:-translate-y-0.5"
                    onClick={() => handleTagClick(item.name)}
                  >
                    <img
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-[148px] h-[110px] sm:w-[162px] sm:h-[120px] md:w-[180px] md:h-[130px] lg:w-full lg:h-[130px] xl:h-[150px] object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
                      src={item.img}
                    />
                    <span className="font-bold text-gray-900 text-[15px] sm:text-[16px] md:text-[17px] lg:text-[16px] xl:text-[18px] text-center block" style={{ marginTop: '-8px' }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2 Dots Pagination */}
          <div className="flex items-center justify-center gap-2 mt-5 md:mt-6" id="cuisine-pagination-dots">
            <button
              aria-label="Page 1"
              className={`cuisine-dot w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
                cuisinePage === 0 ? 'bg-[#E50914] scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              type="button"
              onClick={() => scrollToCuisinePage(0)}
            ></button>
            <button
              aria-label="Page 2"
              className={`cuisine-dot w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
                cuisinePage === 1 ? 'bg-[#E50914] scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              type="button"
              onClick={() => scrollToCuisinePage(1)}
            ></button>
          </div>
        </div>
        </div>
      </section>

      {/* 6. ALL POPULAR DISHES SECTION */}
      <section className="w-full bg-white py-8 sm:py-12 md:py-14 px-3 sm:px-8 lg:px-12 relative select-none mt-2" ref={dishesGridRef}>
        <div className="w-full mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-6 md:mb-8">
          <div className="w-full flex items-center justify-center gap-4 max-w-3xl lg:max-w-4xl mx-auto">
            <div className="flex-1 h-[2px] bg-[#E50914]"></div>
            <h2 className="text-xl sm:text-2xl md:text-[28px] lg:text-[30px] font-black tracking-tight uppercase whitespace-nowrap text-[#111827]">
              ALL <span className="text-[#E50914]">POPULAR DISHES</span>
            </h2>
            <div className="flex-1 h-[2px] bg-[#E50914]"></div>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base font-medium mt-1.5">
            Discover the perfect dishes for your menu or delivery app.
          </p>
        </div>

        {/* 12-Tile Grid Container: strictly 2 equal columns on mobile */}
        <div className="w-full mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6" id="dishes-grid">
            {displayedDishes.map((dish, idx) => (
              <div
                key={`${dish.name}-${idx}`}
                className="dish-card bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 p-2.5 sm:p-3.5 md:p-4 flex flex-col sm:justify-between shadow-xs hover:shadow-md transition-shadow duration-200 h-full w-full overflow-hidden"
              >
                {/* Product Image Container */}
                <div
                  className="relative w-full aspect-square bg-stone-50 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center p-1.5 sm:p-2 mb-2 sm:mb-2.5 cursor-pointer shrink-0"
                  onClick={() => setSelectedModalDish(dish)}
                >
                  <img
                    src={dish.img}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Card Body */}
                <div className="flex flex-col sm:flex-1 sm:justify-between min-w-0 w-full">
                  {/* Metadata Row: Veg Icon + Bestseller Badge (left) and Price (right) */}
                  <div className="flex items-center justify-between gap-1 mb-1.5 w-full shrink-0">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="flex items-center justify-center w-3 h-3 sm:w-3.5 sm:h-3.5 border border-green-600 rounded-[2px] p-[0.5px] shrink-0">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full block"></span>
                      </span>
                      <span className="flex items-center gap-0.5 text-[#E50914] text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] font-bold tracking-tight whitespace-nowrap">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"></path>
                        </svg>
                        Bestseller
                      </span>
                    </div>

                    {/* Price bound to dish.price with ₹ symbol */}
                    <span className="font-extrabold text-gray-900 text-[11.5px] min-[360px]:text-xs sm:text-[13px] md:text-sm tracking-tight shrink-0 whitespace-nowrap">
                      ₹{dish.price ?? 25}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3
                    className="text-[12px] min-[360px]:text-[12.5px] sm:text-[14px] md:text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 sm:h-10 md:h-11 flex items-start mb-1.5 sm:mb-2.5 w-full"
                    title={dish.name}
                  >
                    {dish.name}
                  </h3>
                </div>

                {/* DUAL BUTTONS: [ MORE INFO ] [ ADD TO CART ] - Strictly equal 50% width and identical height */}
                <div className="dish-buttons-wrap grid grid-cols-2 gap-1 sm:gap-1.5 md:gap-2 sm:mt-auto sm:pt-1 w-full shrink-0">
                  <button
                    type="button"
                    className="dish-more-info-btn w-full h-7 sm:h-8 md:h-9 px-0.5 sm:px-1 rounded-lg border border-red-200 hover:border-red-400 bg-white hover:bg-red-50/50 text-[#E50914] font-bold text-[8.5px] min-[360px]:text-[9.5px] min-[400px]:text-[10px] sm:text-[11px] md:text-[12px] tracking-tight uppercase transition-colors flex items-center justify-center text-center cursor-pointer focus:outline-none whitespace-nowrap overflow-hidden"
                    onClick={() => setSelectedModalDish(dish)}
                  >
                    MORE INFO
                  </button>
                  <button
                    type="button"
                    className="dish-add-to-cart-btn w-full h-7 sm:h-8 md:h-9 px-0.5 sm:px-1 rounded-lg border border-red-200 hover:border-red-400 bg-white hover:bg-red-50/50 text-[#E50914] font-bold text-[8.5px] min-[360px]:text-[9.5px] min-[400px]:text-[10px] sm:text-[11px] md:text-[12px] tracking-tight uppercase transition-colors flex items-center justify-center text-center cursor-pointer focus:outline-none whitespace-nowrap overflow-hidden"
                    onClick={() => addToCart(dish)}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls & Counter */}
          <div className="mt-8 md:mt-10 w-full mx-auto flex flex-col items-center">
            {/* Single Large Pill Button Container */}
            <div
              className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-12 sm:h-14 bg-white border border-gray-300 rounded-full shadow-xs flex items-center justify-between px-2 sm:px-4 select-none"
              id="dishes-pagination-container"
            >
              {/* LEFT CLICKABLE AREA: Previous page */}
              <button
                type="button"
                id="dishes-prev-page-btn"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className={`h-full flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 rounded-full font-bold text-xs sm:text-sm md:text-base transition-colors focus:outline-none ${
                  currentPage <= 1
                    ? 'opacity-35 cursor-not-allowed text-gray-400'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100 cursor-pointer active:scale-98'
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-current fill-none stroke-[2.5] shrink-0" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Previous page</span>
              </button>

              {/* RIGHT CLICKABLE AREA: Next page */}
              <button
                type="button"
                id="dishes-next-page-btn"
                onClick={handleNextPage}
                disabled={currentPage >= 14413}
                aria-label="Next page"
                className={`h-full flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 rounded-full font-bold text-xs sm:text-sm md:text-base transition-colors focus:outline-none ${
                  currentPage >= 14413
                    ? 'opacity-35 cursor-not-allowed text-gray-400'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100 cursor-pointer active:scale-98'
                }`}
              >
                <span>Next page</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-current fill-none stroke-[2.5] shrink-0" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Page indicator centered underneath */}
            <p className="mt-3 text-sm font-medium text-gray-400 text-center" id="dishes-page-indicator">
              Page {currentPage} of 14413
            </p>
          </div>

            {/* Couldn't spot what you need? Trending Search Terms */}
            <div className="w-full mx-auto mt-10 md:mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-col text-left shrink-0">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 leading-snug">
                  Couldn’t spot what you need?
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Trending Search Terms</p>
              </div>

              {/* DESKTOP & TABLET VIEW: Expanded to naturally fill width */}
              <div className="hidden sm:flex flex-wrap items-center justify-start md:justify-end gap-2 sm:gap-2.5 flex-1 max-w-3xl lg:max-w-4xl">
                {SEARCH_TERMS.map((term) => (
                  <button
                    key={term}
                    className="bg-white border border-gray-300 hover:border-[#E50914] rounded-md px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-800 transition-colors shadow-xs cursor-pointer focus:outline-none"
                    type="button"
                    onClick={() => handleTagClick(term)}
                  >
                    <span>{term}</span>
                    <svg className="w-3 h-3 text-[#E50914] stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="7"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                ))}
              </div>

              {/* MOBILE VIEW: Exactly 2 rows, 6 terms per row, compact size, no wrapping into 3 or 4 rows */}
              <div className="flex sm:hidden flex-col w-full gap-1.5 mt-2">
                {/* ROW 1: North Indian | Cake | Pizza | Coffee | Waffles | Beverages */}
                <div className="w-full flex items-center justify-start min-[390px]:justify-between gap-1 overflow-x-auto scrollbar-none flex-nowrap py-0.5 touch-pan-x">
                  {SEARCH_TERMS_ROW_1.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleTagClick(term)}
                      className="bg-white border border-gray-300 hover:border-[#E50914] rounded-md px-1.5 py-1 flex items-center gap-1 text-[9.5px] min-[390px]:text-[10px] font-medium text-gray-800 transition-colors shadow-2xs cursor-pointer focus:outline-none shrink-0 whitespace-nowrap"
                    >
                      <span>{term}</span>
                      <svg className="w-2.5 h-2.5 text-[#E50914] stroke-current fill-none stroke-[2.5] shrink-0" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </button>
                  ))}
                </div>

                {/* ROW 2: Kebab | Sandwich | Street Food | Fast Food | Biryani | Burger */}
                <div className="w-full flex items-center justify-start min-[390px]:justify-between gap-1 overflow-x-auto scrollbar-none flex-nowrap py-0.5 touch-pan-x">
                  {SEARCH_TERMS_ROW_2.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleTagClick(term)}
                      className="bg-white border border-gray-300 hover:border-[#E50914] rounded-md px-1.5 py-1 flex items-center gap-1 text-[9.5px] min-[390px]:text-[10px] font-medium text-gray-800 transition-colors shadow-2xs cursor-pointer focus:outline-none shrink-0 whitespace-nowrap"
                    >
                      <span>{term}</span>
                      <svg className="w-2.5 h-2.5 text-[#E50914] stroke-current fill-none stroke-[2.5] shrink-0" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
    )}

    {/* EXACT REPLICA REFERENCE FOOTER */}
    <footer className="w-full bg-[#0d0d0f] border-t border-neutral-800 mt-12 py-10 px-4 sm:px-8 lg:px-12 text-white">
      <div className="w-full mx-auto">
        {/* Three Rectangular Content Boxes */}
        <div className="flex flex-row md:grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-none snap-x -mx-3 px-3 sm:mx-0 sm:px-0">
          {/* BOX 1: Brand & Contact Info */}
          <div className="bg-[#121214] border border-neutral-800 rounded-xl p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col justify-between shadow-xs h-full min-h-[210px] md:min-h-[230px] lg:min-h-[240px] w-[260px] xs:w-[280px] sm:w-[300px] md:w-auto shrink-0 md:shrink snap-start">
            <div>
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="inline-block focus:outline-none mb-3">
                <img
                  alt="Foodbliz Logo"
                  referrerPolicy="no-referrer"
                  className="h-[30px] sm:h-[34px] w-auto object-contain block"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF9T6i3uYGaVX2uSUU5cz1-iawLSqBVCA1Ysqzi0pZP_KS6JMQbKdYMBVMOFlKaxqc24cQsBBBrPl6d6wFTXgLhQUlBpDf03eIEdfbBvgpsAeeYl0-VUzx9JpV3T52m040DwHMp9UO8_yiCm2Bu8lIRcT_vJxW_YVe8P9INm5iXDCb7pF8ZVWMTMJg_Nc378TSs_7C3_FLE2iAFq_vwCO4wgUdCfOBxb-YSACmLrCxbTWIn-wQny3up3w_DLkmNorGMw"
                />
              </a>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs mb-4">
                Professional food photography made for restaurants, cafés and food businesses.
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-800/80 flex flex-col gap-2 text-xs text-gray-300">
              <a href="mailto:support@foodbliz.com" className="flex items-center gap-2 hover:text-[#E50914] transition-colors">
                <svg className="w-3.5 h-3.5 text-[#E50914] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">support@foodbliz.com</span>
              </a>
              <a href="tel:+15553663259" className="flex items-center gap-2 hover:text-[#E50914] transition-colors">
                <svg className="w-3.5 h-3.5 text-[#E50914] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (555) 366-3259</span>
              </a>
            </div>
          </div>

          {/* BOX 2: Our Services & Quick Links */}
          <div className="bg-[#121214] border border-neutral-800 rounded-xl p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col justify-between shadow-xs h-full min-h-[210px] md:min-h-[230px] lg:min-h-[240px] w-[260px] xs:w-[280px] sm:w-[300px] md:w-auto shrink-0 md:shrink snap-start">
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#E50914] rounded-xs inline-block"></span>
                Our Services
              </h4>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-gray-400">
                <button
                  type="button"
                  onClick={scrollToDishes}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group py-0.5 text-left cursor-pointer"
                >
                  <span className="text-[#E50914] text-[11px] group-hover:translate-x-0.5 transition-transform">›</span>
                  <span>Food Photography</span>
                </button>
                <button
                  type="button"
                  onClick={scrollToDishes}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group py-0.5 text-left cursor-pointer"
                >
                  <span className="text-[#E50914] text-[11px] group-hover:translate-x-0.5 transition-transform">›</span>
                  <span>Food Videos</span>
                </button>
                <button
                  type="button"
                  onClick={scrollToDishes}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group py-0.5 text-left cursor-pointer"
                >
                  <span className="text-[#E50914] text-[11px] group-hover:translate-x-0.5 transition-transform">›</span>
                  <span>Menu Photography</span>
                </button>
                <button
                  type="button"
                  onClick={scrollToDishes}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group py-0.5 text-left cursor-pointer"
                >
                  <span className="text-[#E50914] text-[11px] group-hover:translate-x-0.5 transition-transform">›</span>
                  <span>Social Content</span>
                </button>
                <button
                  type="button"
                  onClick={scrollToDishes}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group py-0.5 text-left cursor-pointer"
                >
                  <span className="text-[#E50914] text-[11px] group-hover:translate-x-0.5 transition-transform">›</span>
                  <span>Thumbnail Design</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentRoute('packages');
                    window.location.hash = '#packages';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group py-0.5 text-left cursor-pointer"
                >
                  <span className="text-[#E50914] text-[11px] group-hover:translate-x-0.5 transition-transform">›</span>
                  <span>Custom Packages</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-gray-400">
              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="hover:text-[#E50914] transition-colors cursor-pointer"
              >
                Contact Us
              </button>
              <span className="text-neutral-700">•</span>
              <button
                type="button"
                onClick={() => setFaqModalOpen(true)}
                className="hover:text-[#E50914] transition-colors cursor-pointer"
              >
                FAQs
              </button>
              <span className="text-neutral-700">•</span>
              <button
                type="button"
                onClick={() => showToast('Terms and conditions available on request.')}
                className="hover:text-[#E50914] transition-colors cursor-pointer"
              >
                Terms
              </button>
            </div>
          </div>

          {/* BOX 3: Stay Connected with Input & Button */}
          <div className="bg-[#121214] border border-neutral-800 rounded-xl p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col justify-between shadow-xs h-full min-h-[210px] md:min-h-[230px] lg:min-h-[240px] w-[260px] xs:w-[280px] sm:w-[300px] md:w-auto shrink-0 md:shrink snap-start">
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-white uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#E50914] rounded-xs inline-block"></span>
                Stay Connected
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Subscribe to receive latest photography packages and offers.
              </p>

              {/* Input Placement & Button Placement */}
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs text-white placeholder-gray-500 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-[#E50914] transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-3 bg-[#E50914] hover:bg-[#c81e24] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer focus:outline-none shadow-xs"
                >
                  Subscribe
                </button>
              </form>
            </div>

            <p className="text-[10.5px] text-gray-500 mt-2">
              We respect your privacy. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Social Media Row & Divider */}
        <div className="mt-4 pt-3.5 border-t border-neutral-800 flex items-center justify-center gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Foodbliz on Instagram"
            className="w-7 h-7 rounded-full bg-[#121214] border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#E50914] hover:border-[#E50914] transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Foodbliz on Facebook"
            className="w-7 h-7 rounded-full bg-[#121214] border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#E50914] hover:border-[#E50914] transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
            </svg>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Foodbliz on YouTube"
            className="w-7 h-7 rounded-full bg-[#121214] border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#E50914] hover:border-[#E50914] transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Foodbliz on LinkedIn"
            className="w-7 h-7 rounded-full bg-[#121214] border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#E50914] hover:border-[#E50914] transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>

        {/* Bottom Copyright & Back-to-Top Bar */}
        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p className="text-center sm:text-left text-gray-400 text-xs">
            © 2026 Foodbliz. All Rights Reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-[#E50914] transition-colors cursor-pointer focus:outline-none"
          >
            <span>Back to Top</span>
            <span className="w-5 h-5 rounded bg-[#121214] border border-neutral-800 flex items-center justify-center hover:bg-[#E50914] hover:text-white transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </span>
          </button>
        </div>
        </div>
      </footer>

      {/* FAQ MODAL POPUP */}
      {faqModalOpen && (
        <div
          aria-hidden="false"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
          id="faq-modal"
          onClick={() => setFaqModalOpen(false)}
        >
          <div
            className="relative w-[92vw] sm:w-full max-w-[680px] max-h-[82vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col transform transition-transform duration-200"
            id="faq-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Fixed during scrolling) */}
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight uppercase">
                  FREQUENTLY <span className="text-[#E50914]">ASKED QUESTIONS</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                  Everything you need to know about Foodbliz photography
                </p>
              </div>
              <button
                aria-label="Close FAQ dialog"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black flex items-center justify-center transition-colors focus:outline-none cursor-pointer shrink-0 ml-3"
                type="button"
                onClick={() => setFaqModalOpen(false)}
              >
                <svg className="w-4 h-4 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Scrollable Accordion Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-200 hover:border-gray-300 shadow-2xs"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left font-bold text-gray-900 hover:text-[#E50914] transition-colors focus:outline-none cursor-pointer gap-3"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    >
                      <span className="text-xs sm:text-[14px] leading-snug">
                        <span className="text-[#E50914] mr-1.5 font-black">{idx + 1}.</span>
                        {item.question}
                      </span>
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 shrink-0 ${
                          isOpen
                            ? 'bg-[#E50914] text-white border-[#E50914]'
                            : 'border-gray-200 text-gray-500 hover:border-[#E50914] hover:text-[#E50914]'
                        }`}
                      >
                        <svg
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-[13px] leading-relaxed text-gray-600 border-t border-gray-100">
                        <p>{item.answer}</p>
                        {idx === 9 && (
                          <div className="mt-2.5">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E50914] hover:text-[#c81e24] cursor-pointer focus:outline-none underline"
                              onClick={() => {
                                setFaqModalOpen(false);
                                setContactModalOpen(true);
                              }}
                            >
                              Open Contact Form →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONTACT US POPUP / MODAL */}
      {contactModalOpen && (
        <div
          aria-hidden="false"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
          id="contact-modal"
          onClick={() => setContactModalOpen(false)}
        >
          <div
            className="relative w-[92vw] sm:w-full max-w-[540px] max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col transform transition-transform duration-200"
            id="contact-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight uppercase">
                  CONTACT <span className="text-[#E50914]">FOODBLIZ</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                  Drop us a line and our culinary team will get back to you
                </p>
              </div>
              <button
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black flex items-center justify-center transition-colors focus:outline-none cursor-pointer shrink-0 ml-3"
                id="contact-modal-close"
                type="button"
                onClick={() => setContactModalOpen(false)}
              >
                <svg className="w-4 h-4 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Name <span className="text-[#E50914]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E50914] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email ID <span className="text-[#E50914]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@restaurant.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E50914] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E50914] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Query <span className="text-[#E50914]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your restaurant, dishes, or photoshoot requirements..."
                    value={contactForm.query}
                    onChange={(e) => setContactForm({ ...contactForm, query: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E50914] focus:outline-none transition-colors resize-y"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-[#E50914] hover:bg-[#c81e24] text-white font-extrabold text-sm uppercase tracking-wider transition-colors shadow-sm cursor-pointer focus:outline-none"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN / SIGNUP MODAL */}
      {loginModalOpen && (
        <div
          aria-hidden="false"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
          id="login-signup-modal"
          onClick={() => setLoginModalOpen(false)}
        >
          <div
            className="relative w-full max-w-[420px] sm:max-w-[460px] md:max-w-[780px] lg:max-w-[850px] bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row max-h-[92dvh] md:max-h-[88vh] transform transition-transform duration-200"
            id="login-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top-Right X Close Button */}
            <button
              aria-label="Close dialog"
              className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 md:top-4 md:right-4 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition-colors focus:outline-none cursor-pointer shadow-xs"
              id="login-modal-close"
              type="button"
              onClick={() => setLoginModalOpen(false)}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
                <line x1="18" x2="6" y1="6" y2="18"></line>
                <line x1="6" x2="18" y1="6" y2="18"></line>
              </svg>
            </button>

            {/* LEFT SIDE: DESKTOP & TABLET ONLY - Premium Foodbliz Visual */}
            <div
              className="relative hidden md:flex md:w-5/12 lg:w-1/2 flex-col justify-between p-6 lg:p-9 text-white bg-cover bg-center overflow-hidden shrink-0 select-none"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80')"
              }}
            >
              {/* Rich atmospheric dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/45 pointer-events-none"></div>

              {/* Top Branding */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-bold tracking-wider uppercase text-white mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse"></span>
                  FOODBLIZ STUDIOS
                </div>
              </div>

              {/* Center / Bottom Visual Content */}
              <div className="relative z-10 space-y-3 lg:space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-xl lg:text-2xl font-black text-white leading-tight tracking-tight">
                    Professional <span className="text-[#E50914]">Food Visuals</span> That Drive Orders.
                  </h2>
                  <p className="text-xs lg:text-sm text-gray-300 leading-relaxed font-medium">
                    Commercial food photography, mouth-watering menu styling, and high-converting visual assets for restaurants, cafes & culinary creators.
                  </p>
                </div>

                {/* Feature highlight badges */}
                <div className="pt-2 border-t border-white/15 flex flex-col gap-1.5 text-[11px] lg:text-xs font-semibold text-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#E50914]/25 text-[#E50914] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                    <span>Studio & On-Site Photoshoots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#E50914]/25 text-[#E50914] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                    <span>Delivery-Ready (Zomato, Swiggy, IG)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#E50914]/25 text-[#E50914] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                    <span>48-Hour Fast Turnaround</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: White Background & Clean Form (Begins directly on mobile without hero banner) */}
            <div className="w-full md:w-7/12 lg:w-1/2 p-4 sm:p-6 md:p-7 lg:p-9 flex flex-col justify-center overflow-y-auto overscroll-contain bg-white">
              <div className="w-full max-w-[340px] sm:max-w-[360px] mx-auto flex flex-col gap-3 sm:gap-3.5 my-auto">
                {/* Heading & Subtitle */}
                <div className="pr-6 sm:pr-0">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                    Login or Signup
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">
                    {isSignUpMode
                      ? 'Fill in your details below to create your account.'
                      : 'Welcome back! Please enter your details to sign in.'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-2.5">
                  {isSignUpMode && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Full Name / Business Name
                      </label>
                      <input
                        type="text"
                        required={isSignUpMode}
                        placeholder="e.g. Bella Kitchen or Sarah Lee"
                        value={loginForm.fullName}
                        onChange={(e) => setLoginForm({ ...loginForm, fullName: e.target.value })}
                        className="h-10 sm:h-10.5 w-full px-3.5 text-xs sm:text-[13px] bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E50914] focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email or username
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your email or username"
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      className="h-10 sm:h-10.5 w-full px-3.5 text-xs sm:text-[13px] bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E50914] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        Password
                      </label>
                      {!isSignUpMode && (
                        <button
                          type="button"
                          onClick={() => showToast('Password reset link has been dispatched to your email.')}
                          className="text-[11px] font-semibold text-[#E50914] hover:underline focus:outline-none cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="h-10 sm:h-10.5 w-full px-3.5 pr-10 text-xs sm:text-[13px] bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E50914] focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Primary Button */}
                  <button
                    type="submit"
                    className="h-10 sm:h-10.5 w-full mt-0.5 rounded-xl bg-[#E50914] hover:bg-[#c81e24] active:bg-[#b0161c] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm cursor-pointer focus:outline-none flex items-center justify-center"
                  >
                    {isSignUpMode ? 'Sign Up' : 'Log in'}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-0.5">
                  <div className="border-t border-gray-200 w-full"></div>
                  <span className="bg-white px-2.5 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    or
                  </span>
                  <div className="border-t border-gray-200 w-full"></div>
                </div>

                {/* Social Login Options */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Google authentication connected!');
                      setLoginModalOpen(false);
                    }}
                    className="h-9.5 sm:h-10 w-full flex items-center justify-center gap-2.5 px-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 rounded-xl text-xs font-bold text-gray-700 transition-colors cursor-pointer focus:outline-none shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast('Apple ID connected!');
                      setLoginModalOpen(false);
                    }}
                    className="h-9.5 sm:h-10 w-full flex items-center justify-center gap-2.5 px-3 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer focus:outline-none shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.01-.49 2.63-1.24z" />
                    </svg>
                    <span>Continue with Apple</span>
                  </button>
                </div>

                {/* Switch between Login and Signup */}
                <div className="text-center pt-0.5">
                  <p className="text-xs text-gray-600">
                    {isSignUpMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUpMode(!isSignUpMode)}
                      className="font-bold text-[#E50914] hover:underline focus:outline-none cursor-pointer ml-1"
                    >
                      {isSignUpMode ? 'Log in' : 'Sign up'}
                    </button>
                  </p>
                </div>

                {/* Legal disclaimer */}
                <p className="text-[10px] text-gray-400 text-center leading-normal mt-0.5">
                  By continuing, you agree to Foodbliz's{' '}
                  <a href="#terms" onClick={(e) => { e.preventDefault(); showToast('Terms of Service'); }} className="underline hover:text-gray-600">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast('Privacy Policy'); }} className="underline hover:text-gray-600">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISH INFO MODAL */}
      {selectedModalDish && (
        <div
          aria-hidden="false"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
          id="dish-modal"
          onClick={() => setSelectedModalDish(null)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform transition-transform duration-200"
            id="dish-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close dialog"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-black flex items-center justify-center shadow-sm cursor-pointer transition-colors focus:outline-none"
              id="dish-modal-close"
              type="button"
              onClick={() => setSelectedModalDish(null)}
            >
              <svg className="w-4 h-4 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
                <line x1="18" x2="6" y1="6" y2="18"></line>
                <line x1="6" x2="18" y1="6" y2="18"></line>
              </svg>
            </button>

            <div className="w-full h-52 bg-neutral-50 flex items-center justify-center p-2 relative border-b border-gray-100 overflow-hidden">
              <img
                alt={selectedModalDish.name}
                referrerPolicy="no-referrer"
                className="max-h-[185px] max-w-full object-contain drop-shadow-md scale-[1.5]"
                src={selectedModalDish.img}
              />
            </div>

            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="flex items-center justify-center w-3.5 h-3.5 border border-green-600 rounded-[2px] p-[0.5px] shrink-0" aria-label="Vegetarian">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full block"></span>
                    </span>
                    <span className="flex items-center gap-0.5 text-[#E50914] text-xs font-bold tracking-tight whitespace-nowrap">
                      <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"></path>
                      </svg>
                      Bestseller
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedModalDish.name}</h3>
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight shrink-0 whitespace-nowrap">
                  ₹{selectedModalDish.price ?? 25}
                </span>
              </div>

              {/* Required Metadata Fields - Two Column Table */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 grid grid-cols-[100px_1fr] gap-x-3 gap-y-2 text-xs items-center">
                <span className="font-bold text-gray-700">Price:</span>
                <span className="text-gray-900 font-extrabold text-sm">₹{selectedModalDish.price ?? 25}</span>

                <span className="font-bold text-gray-700">Cuisine:</span>
                <span className="text-gray-900 font-medium">{selectedModalDish.category || 'Specialty Dish'}</span>

                <span className="font-bold text-gray-700">Dimensions:</span>
                <span className="text-gray-900 font-medium">4000 × 3000 px (4:3, 1:1, 16:9)</span>

                <span className="font-bold text-gray-700">Usage:</span>
                <span className="text-gray-900 font-medium">Menus, Zomato/Swiggy, Social Media & Print</span>

                <span className="font-bold text-gray-700">License:</span>
                <span className="text-gray-900 font-medium">Full Commercial Business Rights</span>

                <span className="font-bold text-gray-700">Format:</span>
                <span className="text-gray-900 font-medium">High-Res JPEG / PNG (Retina Ready)</span>

                <span className="font-bold text-gray-700">Exclusivity:</span>
                <span className="text-[#E50914] font-bold">Sold Once Only</span>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  className="w-full py-2.5 px-4 rounded-xl bg-[#E50914] hover:bg-[#c81e24] text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm focus:outline-none"
                  type="button"
                  onClick={() => {
                    addToCart(selectedModalDish);
                    setSelectedModalDish(null);
                  }}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                  </svg>
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART SLIDE-OVER DRAWER */}
      {cartDrawerOpen && (
        <div aria-hidden="false" className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-container">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            id="cart-drawer-backdrop"
            onClick={() => setCartDrawerOpen(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0" id="cart-drawer-panel">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-neutral-900 text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 fill-[#E50914]" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                  </svg>
                  <h2 className="text-base font-bold text-white tracking-wide">Your Cart</h2>
                  <span className="bg-[#E50914] text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1" id="cart-drawer-total-count">
                    {totalCartCount}
                  </span>
                </div>
                <button
                  aria-label="Close cart"
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
                  type="button"
                  onClick={() => setCartDrawerOpen(false)}
                >
                  <svg className="w-5 h-5 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
                    <line x1="18" x2="6" y1="6" y2="18"></line>
                    <line x1="6" x2="18" y1="6" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3" id="cart-drawer-items">
                {Object.keys(cart).length === 0 ? (
                  <p className="text-center text-gray-400 text-sm mt-12">Your cart is currently empty.</p>
                ) : (
                  Object.values(cart).map((item) => (
                    <div key={item.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <img
                        src={item.img}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                        <span className="text-xs font-bold text-gray-800">₹{item.price ?? 25}</span>
                      </div>
                      <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-2 py-1">
                        <button
                          className="cart-minus-btn text-gray-600 hover:text-black font-bold px-1 cursor-pointer"
                          type="button"
                          onClick={() => updateCartQty(item.name, -1)}
                        >
                          −
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                        <button
                          className="cart-plus-btn text-gray-600 hover:text-black font-bold px-1 cursor-pointer"
                          type="button"
                          onClick={() => updateCartQty(item.name, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-2">
                <button
                  className="w-full py-3 bg-[#E50914] hover:bg-[#c81e24] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer focus:outline-none disabled:opacity-50"
                  type="button"
                  disabled={totalCartCount === 0}
                  onClick={() => {
                    showToast('Order placed successfully!');
                    setCart({});
                    setCartDrawerOpen(false);
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST CONFIRMATION */}
      {toastMessage && (
        <div
          className="fixed bottom-6 right-6 z-50 transform translate-y-0 opacity-100 transition-all duration-300 flex items-center gap-2.5 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-800"
          id="cart-toast"
        >
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[3]" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <span className="text-sm font-semibold text-white" id="toast-message">
            {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
}
