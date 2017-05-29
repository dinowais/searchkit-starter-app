import React, { Component } from 'react'
import { extend } from 'lodash'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  ViewSwitcherHits, ViewSwitcherToggle, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar } from 'searchkit'
import './index.css'

// const host = "http://demo.searchkit.co/api/movies"
const host = "http://127.0.0.1:9200/pubbuzz/pubmed/"
const searchkit = new SearchkitManager(host)

const DrugPoolItems = (props)=> {
  const {bemBlocks, result} = props
  const source:any = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href="#" target="_blank">
        <div data-qa="TITLE" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.TITLE}}>
        </div>
      </a>
    </div>
  )
}

const DrugPoolItemsList = (props)=> {
  const {bemBlocks, result} = props
  const source:any = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("details")}>
        <a href="#" target="_blank"><h2 className={bemBlocks.item("TITLE")} dangerouslySetInnerHTML={{__html:source.TITLE}}></h2></a>
        <h3 className={bemBlocks.item("DATE_CREATED")}>Released in {source.year}, rated {source.DATE_CREATED}/10</h3>
        <div className={bemBlocks.item("SOURCE")} dangerouslySetInnerHTML={{__html:source.SOURCE}}></div>
      </div>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo">Searchkit Acme co</div>
            <SearchBox autofocus={true} searchOnChange={true} prefixQueryFields={["DRUG_FOUND", "SOURCE", "TITLE^10", "JOURNAL"]}/>
          </TopBar>

        <LayoutBody>

          <SideBar>
            <RefinementListFilter id="journal" title="Journal" field="JOURNAL" size={10}/>
            <RefinementListFilter id="Sosurce" title="Source" field="SOURCE" size={10}/>
            <RefinementListFilter id="REATED" title="DATE_CREATED" field="DATE_CREATED" size={10}/>
            <RefinementListFilter id="UTHORS" title="PUBDATE" field="PUB_DATE" size={10}/>
          </SideBar>
          <LayoutResults>
            <ActionBar>

              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                  {label:"Relevance", field:"_score", order:"desc"},
                  {label:"Latest Releases", field:"DATE_CREATED", order:"desc"},
                  {label:"Earliest Releases", field:"DATE_CREATED", order:"asc"}
                ]}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <ViewSwitcherHits
                hitsPerPage={12} highlightFields={["TITLE","JOURNAL","SOURCE"]}
                sourceFilter={["TITLE", "SOURCE", "DATE_CREATED", "DRUG_FOUND", "JOURNAL"]}
                hitComponents={[
                  {key:"grid", title:"Grid", itemComponent:DrugPoolItems, defaultOption:true},
                  {key:"list", title:"List", itemComponent:DrugPoolItemsList}
                ]}
                scrollTo="body"
            />
            <NoHits suggestionsField={"title"}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
