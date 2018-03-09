import React, {Component} from "react";
import {extend} from "lodash";
import {
    SearchkitManager,
    SearchkitProvider,
    SearchBox,
    RefinementListFilter,
    Pagination,
    HierarchicalMenuFilter,
    HitsStats,
    SearchkitComponent,
    SortingSelector,
    NoHits,
    ResetFilters,
    RangeFilter,
    NumericRefinementListFilter,
    ViewSwitcherHits,
    ViewSwitcherToggle,
    DynamicRangeFilter,
    InputFilter,
    GroupedSelectedFilters,
    SelectedFilters,
    Layout,
    TopBar,
    LayoutBody,
    LayoutResults,
    ActionBar,
    ActionBarRow,
    SideBar,
    HitItemProps,
    CheckboxFilter,
    TermQuery,
    RangeQuery,
    BoolMust
} from "searchkit";
import "./index.css";

// const host = "http://demo.searchkit.co/api/movies"
// const host = "http://127.0.0.1:9200/pubbuzz/pubmed/"
const host = "http://45.55.133.43:2654/tpdb/databank/"
const searchkit = new SearchkitManager(host)

const DrugPoolItems = (props)=> {
    const {bemBlocks, result} = props
    const source: any = extend({}, result._source, result.highlight)
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
            <a href="#" target="_blank">
                <div data-qa="full_name" className={bemBlocks.item("full_name")}
                     dangerouslySetInnerHTML={{__html: source.full_name}}>
                </div>
            </a>
        </div>
    )
}

const DrugPoolItemsList = (props)=> {
    const {bemBlocks, result} = props
    const source: any = extend({}, result._source, result.highlight)
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
            <div className={bemBlocks.item("details")}>
                <a href="#" target="_blank"><h2 className={bemBlocks.item("full_name")}
                                                dangerouslySetInnerHTML={{__html: source.full_name}}></h2></a>
                <h3 className={bemBlocks.item("start_date")}>Regestered in Year {source.year}</h3>
                <div className={bemBlocks.item("source")} dangerouslySetInnerHTML={{__html: source.source}}></div>
            </div>
        </div>
    )
}

// const RefinementOption = (props) => (
//     <div className={props.bemBlocks.option().state({selected: props.selected}).mix(props.bemBlocks.container("checkbox"))}
//          onClick={props.onClick}>
//         {/*<div className={props.bemBlocks.item("checkbox")}>{props.checkbox}</div>*/}
//         <div className={props.bemBlocks.option("text gull")}>{props.label}</div>
//         <div className={props.bemBlocks.option("count")}>{props.count}</div>
//     </div>
// )
// const RefinementOption = (props) => (
//   <div className={props.bemBlocks.item().state({selected:props.selected}).mix(this.bemBlocks.container("item"))} onClick={props.onClick}>
//     <div className={props.bemBlocks.item("label")}>{props.label}</div>
//     <div className={props.bemBlocks.item("count")}>{props.docCount}</div>
//   </div>
// )

class DrugPoolItemsTable extends React.Component {

    render() {
        const {hits} = this.props;
        console.log(hits);
        var drugPoolItems = hits.map(function (hit) {
            return (
                <tr key={hit._source.id}>
                    <td>{hit._source.full_name}</td>
                    <td>{hit._source.site_name}</td>
                    <td>{hit._source.therapeutic_area}</td>
                    <td>{hit._source.country}</td>
                    <td>{hit._source.start_date}</td>
                </tr>
            )
        });
        return (
            <div style={{width: '100%', boxSizing: 'border-box', padding: 8}}>
                <table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Associated Site</th>
                        <th>Therapautic Area</th>
                        <th>Region</th>
                        <th>Date Added</th>
                    </tr>
                    </thead>
                    <tbody>
                    {drugPoolItems}
                    </tbody>
                </table>
            </div>
        )
    }
}
class SearchHeader extends Component {
    render() {
        return (
            <TopBar>
                <div className="my-logo">Search-Kit</div>
                <SearchBox autofocus={true} searchOnChange={true}
                           placeholder="Search......"
                           searchThrottleTime="300"
                           prefixQueryFields={["full_name", "site_name", "source", "therapeutic_area"]}/>
            </TopBar>
        )
    }
}
class App extends Component {
    render() {
        return (
            <SearchkitProvider searchkit={searchkit}>
                <Layout>
                    <SearchHeader/>
                    <LayoutBody>

                        <SideBar>
                            <RefinementListFilter id="source" title="Source" field="source" size={10} operator="OR"/>
                            <RefinementListFilter id="Therapeutic_area" title="Therapeutic Area"
                                                  field="therapeutic_area.raw" size={10} operator="OR"/>

                            <RefinementListFilter id="Country" title="Country" field="country.raw" size={10}
                                                  operator="OR"/>
                            <NumericRefinementListFilter id="hcp_id_nr" title="HCP ID"
                                                         field="hcp_id" options={[
                                {title: "All"},
                                {title: "up to 2000", from: 0, to: 2001},
                                {title: "2001 to 4000", from: 2001, to: 4001},
                                {title: "4001 to 6000", from: 4001, to: 6001},
                                {title: "6001 to 10000", from: 6001, to: 10001},
                                {title: "10001 to 1000000", from: 10001, to: 1000001}
                            ]}/>
                            <RangeFilter field="minimium_experience" id="minimium_experience" min={0} max={50}
                                         showHistogram={true} title="Minimium Experience"/>
                            <CheckboxFilter id="year" title="Recent Investigators from 2013" label="investigators"
                                            filter={RangeQuery("year", {gt: 2013})}/>
                            <CheckboxFilter id="year_inv" title="Investigator filter" label="Old Investigator" filter={
                                BoolMust([
                                    RangeQuery("year", {lt: 2013}),
                                    TermQuery("source", "ctgov")
                                ])}/>
                        </SideBar>
                        <LayoutResults>
                            <ActionBar>

                                <ActionBarRow>
                                    <HitsStats translations={{
                                        "hitstats.results_found": "{hitCount} results found"
                                    }}/>
                                    <ViewSwitcherToggle/>
                                </ActionBarRow>

                                <ActionBarRow>
                                    {/*<SelectedFilters/>*/}
                                    <GroupedSelectedFilters/>
                                    <ResetFilters/>
                                </ActionBarRow>

                            </ActionBar>
                            <ViewSwitcherHits
                                hitsPerPage={20}
                                highlightFields={["full_name", "site_name", "therapeutic_area", "name_last", "name_first"]}
                                sourceFilter={["full_name", "name_first", "name_last", "site_name", 'year', "therapeutic_area", "start_date", "source", "id", "country", "zip"]}
                                hitComponents={[
                                    {key: "grid", title: "Map", itemComponent: DrugPoolItems, defaultOption: true},
                                    {key: "table", title: "Table", listComponent: DrugPoolItemsTable}
                                ]}
                                scrollTo="body"
                            />
                            <NoHits translations={{
                                "NoHits.NoResultsFound": "No Investigators found were found for {query}",
                                "NoHits.DidYouMean": "Search for {suggestion}",
                                "NoHits.SearchWithoutFilters": "Search for {query} without filters"
                            }} suggestionsField={"title"}/>
                            <Pagination showNumbers={true}/>
                        </LayoutResults>

                    </LayoutBody>
                </Layout>
            </SearchkitProvider>
        );
    }
}

export default App;
