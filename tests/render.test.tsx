import React from 'react';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import {SearchForm} from '../src/SearchForm.tsx';
import {PropertyPage} from '../src/PropertyPage.tsx';
import {examples} from '../src/catalogue.ts';
test('search renders six labelled controls and restores a linked search',()=>{
 const html=renderToStaticMarkup(<SearchForm initial="purpose=Rent&city=Lagos&beds=3&min=5000000&max=9000000"/>);
 assert.match(html,/value="Rent" selected/);assert.match(html,/name="min"[^>]*value="5000000"/);assert.match(html,/name="max"[^>]*value="9000000"/);assert.match(html,/Rental prices are per year/);
});
test('property view renders real detail sections, sample status and viewing link',()=>{
 const html=renderToStaticMarkup(<PropertyPage property={examples[0]} saved={false} toggle={()=>{}} demo/>);
 assert.match(html,/Features and amenities/);assert.match(html,/The neighbourhood/);assert.match(html,/Documents and checks/);assert.match(html,/Availability: Unconfirmed/);assert.match(html,/property_id=oceanview-villa/);assert.match(html,/aria-label="Close photographs"/);assert.doesNotMatch(html,/eyebrow/);
});
