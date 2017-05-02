var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var LiteMol;
(function (LiteMol) {
    var PrankWeb;
    (function (PrankWeb) {
        var _this = this;
        var Bootstrap = LiteMol.Bootstrap;
        var Entity = Bootstrap.Entity;
        PrankWeb.SequenceEntity = Entity.create({
            name: 'Protein sequence',
            typeClass: 'Data',
            shortName: 'PS',
            description: 'Represents sequence of the protein.'
        });
        PrankWeb.CreateSequence = Bootstrap.Tree.Transformer.create({
            id: 'protein-sequence-create',
            name: 'Protein sequence',
            description: 'Create protein sequence from string.',
            from: [Entity.Data.Json],
            to: [PrankWeb.SequenceEntity],
            defaultParams: function () { return ({}); }
        }, function (context, a, t) {
            return Bootstrap.Task.create("Create sequence entity", 'Normal', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                var seq;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ctx.updateProgress('Creating sequence entity...')];
                        case 1:
                            _a.sent();
                            seq = a.props.data;
                            // Get rid of the negative scores.
                            if (seq.scores) {
                                seq.scores.forEach(function (score, i) {
                                    seq.scores[i] = score < 0 ? 0 : score;
                                });
                            }
                            return [2 /*return*/, PrankWeb.SequenceEntity.create(t, { label: 'Sequence', seq: seq })];
                    }
                });
            }); }).setReportTime(true);
        });
    })(PrankWeb = LiteMol.PrankWeb || (LiteMol.PrankWeb = {}));
})(LiteMol || (LiteMol = {}));
var LiteMol;
(function (LiteMol) {
    var PrankWeb;
    (function (PrankWeb) {
        var _this = this;
        var Bootstrap = LiteMol.Bootstrap;
        var Entity = Bootstrap.Entity;
        PrankWeb.Colors = Bootstrap.Immutable.List.of(LiteMol.Visualization.Color.fromRgb(0, 0, 255), //Blue
        LiteMol.Visualization.Color.fromRgb(255, 0, 0), //Red
        LiteMol.Visualization.Color.fromRgb(0, 255, 0), //Green
        LiteMol.Visualization.Color.fromRgb(255, 0, 255), //Magenta
        LiteMol.Visualization.Color.fromRgb(255, 128, 128), //Pink
        LiteMol.Visualization.Color.fromRgb(128, 0, 0), //Brown
        LiteMol.Visualization.Color.fromRgb(255, 128, 0)); //Orange
        PrankWeb.Prediction = Entity.create({
            name: 'Pocket prediction',
            typeClass: 'Data',
            shortName: 'PP',
            description: 'Represents predicted protein-ligand binding pockets.'
        });
        PrankWeb.ParseAndCreatePrediction = Bootstrap.Tree.Transformer.create({
            id: 'protein-pocket-prediction-parse',
            name: 'Protein predicted pockets',
            description: 'Parse protein pocket prediction.',
            from: [Entity.Data.Json],
            to: [PrankWeb.Prediction],
            defaultParams: function () { return ({}); }
        }, function (context, a, t) {
            return Bootstrap.Task.create("Create protein prediction entity.", 'Normal', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ctx.updateProgress('Creating prediction data...')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, PrankWeb.Prediction.create(t, { label: 'Sequence', pockets: a.props.data })];
                    }
                });
            }); }).setReportTime(true);
        });
    })(PrankWeb = LiteMol.PrankWeb || (LiteMol.PrankWeb = {}));
})(LiteMol || (LiteMol = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LiteMol;
(function (LiteMol) {
    var PrankWeb;
    (function (PrankWeb) {
        var Plugin = LiteMol.Plugin;
        var Views = Plugin.Views;
        var Bootstrap = LiteMol.Bootstrap;
        var React = LiteMol.Plugin.React; // this is to enable the HTML-like syntax
        var CacheItem = (function () {
            function CacheItem(query, selectionInfo) {
                this.query = query;
                this.selectionInfo = selectionInfo;
            }
            return CacheItem;
        }());
        var Feature = (function () {
            function Feature(regionType, color, start, end, label, properties) {
                this.regionType = regionType;
                this.color = color;
                this.start = start;
                this.end = end;
                this.label = label;
                this.properties = properties;
            }
            return Feature;
        }());
        var ProtaelContent = (function () {
            function ProtaelContent(seq, pocketFeatures, conservationScores) {
                this.qtracks = [];
                this.sequence = seq;
                this.ftracks = [{ label: "Pockets", color: "blue", showLine: false, allowOverlap: false, features: pocketFeatures }];
                if (conservationScores != null && conservationScores.length >= 0) {
                    this.qtracks = [{ label: "Evolutionary conservation", color: "gray", type: "column", values: conservationScores }];
                }
            }
            return ProtaelContent;
        }());
        var SequenceView = (function (_super) {
            __extends(SequenceView, _super);
            function SequenceView() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.protaelView = void 0;
                return _this;
            }
            SequenceView.prototype.getResidue = function (seqIndex, model) {
                var cacheId = "__resSelectionInfo-" + seqIndex;
                var result = this.getCacheItem(cacheId, model);
                if (!result) {
                    var pdbResIndex = this.controller.latestState.seq.indices[seqIndex];
                    result = this.setCacheItem(cacheId, LiteMol.Core.Structure.Query.residuesById(pdbResIndex), model);
                }
                return result;
            };
            SequenceView.prototype.getPocket = function (pocket, model) {
                var cacheId = "__resSelectionInfo-" + pocket.name + "-" + pocket.rank;
                var result = this.getCacheItem(cacheId, model);
                if (!result)
                    result = this.setCacheItem(cacheId, LiteMol.Core.Structure.Query.atomsById.apply(null, pocket.surfAtomIds), model);
                return result;
            };
            SequenceView.prototype.setCacheItem = function (cacheId, query, model) {
                var cache = this.controller.context.entityCache;
                var elements = LiteMol.Core.Structure.Query.apply(query, model.props.model).unionAtomIndices();
                var selection = Bootstrap.Interactivity.Info.selection(model, elements);
                var selectionInfo = Bootstrap.Interactivity.Molecule.transformInteraction(selection);
                var item = new CacheItem(query, selectionInfo);
                cache.set(model, cacheId, item);
                return item;
            };
            SequenceView.prototype.getCacheItem = function (cacheId, model) {
                var cache = this.controller.context.entityCache;
                var item = cache.get(model, cacheId);
                if (!item)
                    return void 0;
                return item;
            };
            SequenceView.prototype.addPocketFeatures = function (features) {
                var _this = this;
                this.indexMap = LiteMol.Core.Utils.FastMap.create();
                // Build hashmap index->sequential index one-based.
                this.controller.latestState.seq.indices.forEach(function (index, seqIndex) {
                    _this.indexMap.set(index, seqIndex + 1);
                });
                var pockets = this.controller.latestState.pockets;
                var pocketVisibility = this.controller.latestState.pocketVisibility;
                pockets.forEach(function (pocket, i) {
                    if (!pocketVisibility[i])
                        return; // Skip over invisible pockets.
                    // Transform indices to sequential indices and then sort them
                    var sortedIndices = pocket.residueIds.map(function (index) { return _this.indexMap.get(index); })
                        .sort(function (a, b) { return (a - b); });
                    var lastStart = -1;
                    var lastResNum = -1;
                    sortedIndices.forEach(function (resNum, y) {
                        if (y == 0) {
                            lastStart = resNum;
                        }
                        else {
                            if (lastResNum + 1 < resNum) {
                                var c_1 = PrankWeb.Colors.get(i % PrankWeb.Colors.size);
                                features.push(new Feature("Pockets", "rgb(" + c_1.r * 255 + ", " + c_1.g * 255 + ", " + c_1.b * 255 + ")", lastStart, lastResNum, pocket.rank.toString(), { "Pocket name": pocket.name }));
                                lastStart = resNum;
                            }
                        }
                        lastResNum = resNum;
                    });
                    var c = PrankWeb.Colors.get(i % PrankWeb.Colors.size);
                    features.push(new Feature("Pockets", "rgb(" + c.r * 255 + ", " + c.g * 255 + ", " + c.b * 255 + ")", lastStart, lastResNum, pocket.rank.toString(), { "Pocket name": pocket.name }));
                });
            };
            SequenceView.prototype.componentDidMount = function () {
                var _this = this;
                this.subscribe(this.controller.state, function (state) {
                    _this.updateProtael();
                });
                this.updateProtael();
            };
            SequenceView.prototype.componentDidUpdate = function () {
                this.updateProtael();
            };
            SequenceView.prototype.createProtelContent = function () {
                var seq = this.controller.latestState.seq;
                console.log(seq);
                if (seq.seq.length <= 0)
                    return void 0; // Sequence isn't loaded yet.
                var features = [];
                this.addPocketFeatures(features); // Add pocket features.
                return new ProtaelContent(seq.seq.join(""), features, seq.scores);
            };
            SequenceView.prototype.updateProtael = function () {
                var _this = this;
                var protaelContent = this.createProtelContent();
                if (!protaelContent)
                    return;
                if (this.protaelView) {
                    try {
                        var el = document.getElementsByClassName("protael_resizable").item(0);
                        el.parentNode.removeChild(el);
                    }
                    catch (err) {
                        console.log("Unable to remove Protael, " + err);
                    }
                }
                var seqViewEl = document.getElementById("seqView");
                if (!seqViewEl) {
                    console.log("No seqView element!");
                }
                this.protaelView = createProtael(protaelContent, "seqView", true);
                this.protaelView.draw();
                this.protaelView.onMouseOver(function (e) {
                    if (e.offsetX == 0)
                        return;
                    var seqNum = _this.protaelView.toOriginalX(e.offsetX);
                    _this.onLetterMouseEnter(seqNum);
                });
                // pViz.FeatureDisplayer.mouseoverCallBacks = {};
                // pViz.FeatureDisplayer.mouseoutCallBacks = {};
                // Add mouse callbacks.
                /*
                pViz.FeatureDisplayer.addMouseoverCallback(pocketFeatureLabels, (feature: any) => {
                    this.selectAndDisplayToastPocket(this.lastMouseOverFeature, false);
                    this.lastMouseOverFeature = this.parsePocketName(feature.type);
                    this.selectAndDisplayToastPocket(this.lastMouseOverFeature, true);
                }).addMouseoutCallback(pocketFeatureLabels, (feature: any) => {
                    this.selectAndDisplayToastPocket(this.lastMouseOverFeature, false);
                    this.lastMouseOverFeature = void 0;
                });
                */
            };
            SequenceView.prototype.onLetterMouseEnter = function (seqNumber) {
                if (!seqNumber && seqNumber != 0)
                    return;
                if (this.lastNumber) {
                    if (this.lastNumber != seqNumber) {
                        this.selectAndDisplayToastLetter(this.lastNumber, false);
                        this.selectAndDisplayToastLetter(seqNumber, true);
                    }
                }
                else {
                    this.selectAndDisplayToastLetter(seqNumber, true);
                }
                this.lastNumber = seqNumber;
            };
            // Displays/Hides toast for given residue. SeqNumber is ***zero-based index*** of the residue.
            SequenceView.prototype.selectAndDisplayToastLetter = function (seqNumber, isOn) {
                if ((!seqNumber && seqNumber != 0) || seqNumber < 0)
                    return;
                var ctx = this.controller.context;
                var model = ctx.select('model')[0];
                if (!model)
                    return;
                // Get the sequence selection
                var seqSel = this.getResidue(seqNumber, model);
                // Highlight in the 3D Visualization
                Bootstrap.Command.Molecule.Highlight.dispatch(ctx, { model: model, query: seqSel.query, isOn: isOn });
                if (isOn) {
                    // Show tooltip
                    var label = Bootstrap.Interactivity.Molecule.formatInfo(seqSel.selectionInfo);
                    Bootstrap.Event.Interactivity.Highlight.dispatch(ctx, [label /*, 'some additional label'*/]);
                }
                else {
                    // Hide tooltip
                    Bootstrap.Event.Interactivity.Highlight.dispatch(ctx, []);
                }
            };
            SequenceView.prototype.parsePocketName = function (pocketFeatureType) {
                // Using the fact that * is greedy, so it will match everything up to and including the last space.
                var res = pocketFeatureType.match(".* ");
                if (!res)
                    return void 0;
                var pocketName = res[0].trim();
                var pocketRes = void 0;
                this.controller.latestState.pockets.forEach(function (pocket) {
                    if (pocket.name == pocketName)
                        pocketRes = pocket;
                });
                return pocketRes;
            };
            SequenceView.prototype.selectAndDisplayToastPocket = function (pocket, isOn) {
                if (!pocket)
                    return;
                var ctx = this.controller.context;
                var model = ctx.select('model')[0];
                if (!model)
                    return;
                // Get the pocket selection
                var seqSel = this.getPocket(pocket, model);
                // Highlight in the 3D Visualization
                Bootstrap.Command.Molecule.Highlight.dispatch(ctx, { model: model, query: seqSel.query, isOn: isOn });
                if (isOn) {
                    // Show tooltip
                    var label = Bootstrap.Interactivity.Molecule.formatInfo(seqSel.selectionInfo);
                    Bootstrap.Event.Interactivity.Highlight.dispatch(ctx, [label /*, 'some additional label'*/]);
                }
                else {
                    // Hide tooltip
                    Bootstrap.Event.Interactivity.Highlight.dispatch(ctx, []);
                }
            };
            SequenceView.prototype.onLetterClick = function (seqNumber, letter) {
                var ctx = this.controller.context;
                var model = ctx.select('model')[0];
                if (!model)
                    return;
                var query = this.getResidue(seqNumber, model).query;
                Bootstrap.Command.Molecule.FocusQuery.dispatch(ctx, { model: model, query: query });
            };
            SequenceView.prototype.render = function () {
                var seqId = -1;
                return React.createElement("div", { id: "seqView", className: "noselect" /*onMouseLeave={() => { this.onLetterMouseEnter(void 0); }}*/ });
            };
            return SequenceView;
        }(Views.View));
        PrankWeb.SequenceView = SequenceView;
        var SequenceController = (function (_super) {
            __extends(SequenceController, _super);
            function SequenceController(context) {
                var _this = _super.call(this, context, { seq: { indices: [], seq: [], scores: [] }, pockets: [], pocketVisibility: [], version: 0 }) || this;
                Bootstrap.Event.Tree.NodeAdded.getStream(context).subscribe(function (e) {
                    if (e.data.type === PrankWeb.SequenceEntity) {
                        _this.setState({ seq: e.data.props.seq });
                    }
                    else if (e.data.type === PrankWeb.Prediction) {
                        var pockets = e.data.props.pockets;
                        _this.setState({ pockets: pockets, pocketVisibility: pockets.map(function () { return true; }) });
                    }
                });
                // Subscribe to get updates about visibility of pockets.
                Bootstrap.Event.Tree.NodeUpdated.getStream(context).subscribe(function (e) {
                    var entityRef = e.data.ref; // Pocket name whose visibility just changed.
                    var pockets = _this.latestState.pockets;
                    var changed = false;
                    var pocketVisibility = _this.latestState.pocketVisibility;
                    var i = 0;
                    for (var _i = 0, pockets_1 = pockets; _i < pockets_1.length; _i++) {
                        var pocket = pockets_1[_i];
                        if (pocket.name !== entityRef) {
                            i++;
                            continue;
                        }
                        // It should still be visible even if some children are invisible.
                        var visible = (e.data.state.visibility === 0 /* Full */ || e.data.state.visibility === 1 /* Partial */);
                        if (pocketVisibility[i] !== visible) {
                            pocketVisibility[i] = visible;
                            changed = true;
                        }
                        break;
                    }
                    if (changed) {
                        // Keeping version field in the state, so that event about state update is fired. 
                        _this.setState({ pockets: pockets, pocketVisibility: pocketVisibility, version: _this.latestState.version + 1 });
                    }
                });
                return _this;
            }
            return SequenceController;
        }(Bootstrap.Components.Component));
        PrankWeb.SequenceController = SequenceController;
    })(PrankWeb = LiteMol.PrankWeb || (LiteMol.PrankWeb = {}));
})(LiteMol || (LiteMol = {}));
var LiteMol;
(function (LiteMol) {
    var PrankWeb;
    (function (PrankWeb) {
        var Query = LiteMol.Core.Structure.Query;
        var Bootstrap = LiteMol.Bootstrap;
        var React = LiteMol.Plugin.React; // this is to enable the HTML-like syntax
        var CacheItem = (function () {
            function CacheItem(query, selectionInfo) {
                this.query = query;
                this.selectionInfo = selectionInfo;
            }
            return CacheItem;
        }());
        var PocketList = (function (_super) {
            __extends(PocketList, _super);
            function PocketList() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            PocketList.prototype.calcConservationAvg = function () {
                var seq = this.props.data.sequence.props.seq;
                var pockets = this.props.data.prediction.props.pockets;
                if (!seq.scores || seq.scores.length <= 0)
                    return pockets.map(function () { return "N/A"; });
                var indexMap = LiteMol.Core.Utils.FastMap.create();
                seq.indices.forEach(function (element, i) { indexMap.set(element, i); });
                return pockets.map(function (pocket, i) {
                    var scoreSum = pocket.residueIds.map(function (i) { return seq.scores[indexMap.get(i)]; }).reduce(function (acc, val) { return acc + val; }, 0);
                    // Round the score to 3 digit average.
                    return (scoreSum / pocket.residueIds.length).toFixed(3);
                });
            };
            PocketList.prototype.render = function () {
                var _this = this;
                var pockets = this.props.data.prediction.props.pockets;
                var ctx = this.props.plugin.context;
                var controls = [];
                var conservationAvg = this.calcConservationAvg();
                if (pockets.length > 0) {
                    controls.push(React.createElement("h2", { className: "text-center" }, "Pockets"));
                }
                pockets.forEach(function (pocket, i) {
                    controls.push(React.createElement(Pocket, { plugin: _this.props.plugin, model: _this.props.data.model, pocket: pocket, index: i, conservationAvg: conservationAvg[i] }));
                });
                return (React.createElement("div", { className: "pockets" }, controls));
            };
            return PocketList;
        }(React.Component));
        PrankWeb.PocketList = PocketList;
        var Pocket = (function (_super) {
            __extends(Pocket, _super);
            function Pocket() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.state = { isVisible: true };
                return _this;
            }
            Pocket.prototype.componentWillMount = function () {
                var _this = this;
                var ctx = this.props.plugin.context;
                Bootstrap.Event.Tree.NodeUpdated.getStream(ctx).subscribe(function (e) {
                    var entityRef = e.data.ref; // Pocket name whose visibility just changed.
                    var pocket = _this.props.pocket;
                    if (entityRef === pocket.name) {
                        // It should still be visible even if some children are invisible.
                        var visible = (e.data.state.visibility === 0 /* Full */ || e.data.state.visibility === 1 /* Partial */);
                        if (_this.state.isVisible !== visible) {
                            _this.setState({ isVisible: visible });
                            _this.toggleColoring(visible);
                        }
                    }
                });
            };
            Pocket.prototype.toggleColoring = function (isVisible) {
                var mapping = PrankWeb.DataLoader.getAtomColorMapping(this.props.plugin, this.props.model, false);
                var pocketQuery = Query.atomsById.apply(null, this.props.pocket.surfAtomIds).compile();
                if (!mapping)
                    return;
                if (isVisible) {
                    var colorIndex = (this.props.index % PrankWeb.Colors.size) + 1; // Index of color that we want for the particular atom. i.e. Colors.get(i%Colors.size);
                    for (var _i = 0, _a = pocketQuery(this.props.model.props.model.queryContext).unionAtomIndices(); _i < _a.length; _i++) {
                        var atom = _a[_i];
                        mapping[atom] = colorIndex;
                    }
                }
                else {
                    var originalMapping = PrankWeb.DataLoader.getAtomColorMapping(this.props.plugin, this.props.model, true);
                    if (!originalMapping)
                        return;
                    for (var _b = 0, _c = pocketQuery(this.props.model.props.model.queryContext).unionAtomIndices(); _b < _c.length; _b++) {
                        var atom = _c[_b];
                        mapping[atom] = originalMapping[atom];
                    }
                }
                PrankWeb.DataLoader.setAtomColorMapping(this.props.plugin, this.props.model, mapping, false);
                PrankWeb.DataLoader.colorProtein(this.props.plugin);
            };
            Pocket.prototype.getPocket = function () {
                var ctx = this.props.plugin.context;
                var cache = ctx.entityCache;
                var pocket = this.props.pocket;
                var model = this.props.model;
                var cacheId = "__pocketSelectionInfo-" + pocket.name;
                var item = cache.get(model, cacheId);
                if (!item) {
                    var selectionQ = LiteMol.Core.Structure.Query.atomsById.apply(null, pocket.surfAtomIds); //Core.Structure.Query.chains({ authAsymId: 'A' })
                    var elements = LiteMol.Core.Structure.Query.apply(selectionQ, model.props.model).unionAtomIndices();
                    var selection = Bootstrap.Interactivity.Info.selection(model, elements);
                    var selectionInfo = Bootstrap.Interactivity.Molecule.transformInteraction(selection);
                    item = new CacheItem(selectionQ, selectionInfo);
                    cache.set(model, cacheId, item);
                }
                return item;
            };
            Pocket.prototype.onPocketMouse = function (enter) {
                // Cannot focus on hidden pocket.
                if (!this.state.isVisible)
                    return;
                var ctx = this.props.plugin.context;
                var model = this.props.model;
                // Get the sequence selection
                var pocketSel = this.getPocket();
                // Highlight in the 3D Visualization
                Bootstrap.Command.Molecule.Highlight.dispatch(ctx, { model: model, query: pocketSel.query, isOn: enter });
                if (enter) {
                    // Show tooltip
                    var label = Bootstrap.Interactivity.Molecule.formatInfo(pocketSel.selectionInfo);
                    Bootstrap.Event.Interactivity.Highlight.dispatch(ctx, [label, "Pocket score: " + this.props.pocket.score]);
                }
                else {
                    // Hide tooltip
                    Bootstrap.Event.Interactivity.Highlight.dispatch(ctx, []);
                }
            };
            Pocket.prototype.onPocketClick = function () {
                // Cannot focus on hidden pocket.
                if (!this.state.isVisible)
                    return;
                var ctx = this.props.plugin.context;
                var model = this.props.model;
                var query = this.getPocket().query;
                Bootstrap.Command.Molecule.FocusQuery.dispatch(ctx, { model: model, query: query });
            };
            Pocket.prototype.toggleVisibility = function () {
                var ctx = this.props.plugin.context;
                var pocketEntity = ctx.select(this.props.pocket.name)[0];
                if (pocketEntity) {
                    Bootstrap.Command.Entity.SetVisibility.dispatch(this.props.plugin.context, { entity: pocketEntity, visible: !this.state.isVisible });
                }
                this.setState({ isVisible: !this.state.isVisible });
            };
            // https://css-tricks.com/left-align-and-right-align-text-on-the-same-line/
            Pocket.prototype.render = function () {
                var _this = this;
                var pocket = this.props.pocket;
                var focusIconDisplay = this.state.isVisible ? "inherit" : "none";
                var hideIconOpacity = this.state.isVisible ? 1 : 0.3;
                var c = PrankWeb.Colors.get(this.props.index % PrankWeb.Colors.size);
                return React.createElement("div", { className: "pocket", style: { borderColor: "rgb(" + c.r * 255 + ", " + c.g * 255 + ", " + c.b * 255 + ")" } },
                    React.createElement("button", { style: { float: 'left', display: focusIconDisplay }, title: "Focus", className: "pocket-btn", onClick: function () { _this.onPocketClick(); }, onMouseEnter: function () { _this.onPocketMouse(true); }, onMouseOut: function () { _this.onPocketMouse(false); } },
                        React.createElement("span", { className: "pocket-icon focus-icon" })),
                    React.createElement("button", { style: { float: 'right', opacity: hideIconOpacity }, title: "Hide", className: "pocket-btn", onClick: function () { _this.toggleVisibility(); } },
                        React.createElement("span", { className: "pocket-icon hide-icon" })),
                    React.createElement("div", { style: { clear: 'both' } }),
                    React.createElement("p", { style: { float: 'left' }, className: "pocket-feature" }, "Pocket rank:"),
                    React.createElement("p", { style: { float: 'right' } }, pocket.rank),
                    React.createElement("div", { style: { clear: 'both' } }),
                    React.createElement("p", { style: { float: 'left' }, className: "pocket-feature" }, "Pocket score:"),
                    React.createElement("p", { style: { float: 'right' } }, pocket.score),
                    React.createElement("div", { style: { clear: 'both' } }),
                    React.createElement("p", { style: { float: 'left' }, className: "pocket-feature" }, "AA count:"),
                    React.createElement("p", { style: { float: 'right' } }, pocket.residueIds.length),
                    React.createElement("div", { style: { clear: 'both' } }),
                    React.createElement("p", { style: { float: 'left', textDecoration: 'overline' }, className: "pocket-feature" }, "Conservation:"),
                    React.createElement("p", { style: { float: 'right' } }, this.props.conservationAvg),
                    React.createElement("div", { style: { clear: 'both' } }));
            };
            return Pocket;
        }(React.Component));
        PrankWeb.Pocket = Pocket;
    })(PrankWeb = LiteMol.PrankWeb || (LiteMol.PrankWeb = {}));
})(LiteMol || (LiteMol = {}));
var LiteMol;
(function (LiteMol) {
    var PrankWeb;
    (function (PrankWeb) {
        var DataLoader;
        (function (DataLoader) {
            var Bootstrap = LiteMol.Bootstrap;
            var Transformer = Bootstrap.Entity.Transformer;
            var Query = LiteMol.Core.Structure.Query;
            function initColorMapping(model, prediction, sequence) {
                var atomColorMapConservation = new Uint8Array(model.props.model.data.atoms.count);
                var atomColorMap = new Uint8Array(model.props.model.data.atoms.count);
                var seq = sequence.props.seq;
                var seqIndices = seq.indices;
                var seqScores = seq.scores;
                if (seqScores != null) {
                    seqIndices.forEach(function (seqIndex, i) {
                        var shade = Math.round((1 - seqScores[i]) * 10); // Shade within [0,10]
                        var query = Query.residuesById(seqIndex).compile();
                        for (var _i = 0, _a = query(model.props.model.queryContext).unionAtomIndices(); _i < _a.length; _i++) {
                            var atom = _a[_i];
                            atomColorMap[atom] = shade + PrankWeb.Colors.size + 1; // First there is fallbackColor(0), then pocketColors(1-9) and lastly conservation colors.
                            atomColorMapConservation[atom] = shade + PrankWeb.Colors.size + 1; // First there is fallbackColor(0), then pocketColors(1-9) and lastly conservation colors.
                        }
                    });
                }
                var pockets = prediction.props.pockets;
                pockets.forEach(function (pocket, i) {
                    var pocketQuery = Query.atomsById.apply(null, pocket.surfAtomIds).compile();
                    var colorIndex = (i % PrankWeb.Colors.size) + 1; // Index of color that we want for the particular atom. i.e. Colors.get(i%Colors.size);
                    for (var _i = 0, _a = pocketQuery(model.props.model.queryContext).unionAtomIndices(); _i < _a.length; _i++) {
                        var atom = _a[_i];
                        atomColorMap[atom] = colorIndex;
                    }
                });
                return { atomColorMap: atomColorMap, atomColorMapConservation: atomColorMapConservation };
            }
            function loadData(plugin, inputType, inputId) {
                return new LiteMol.Promise(function (res, rej) {
                    plugin.clear();
                    var pdbUrl;
                    var seqUrl;
                    var csvUrl;
                    if (inputType == "pdb") {
                        pdbUrl = "/api/id/pdb/" + inputId;
                        csvUrl = "/api/id/csv/" + inputId;
                        seqUrl = "/api/id/seq/" + inputId;
                    }
                    else {
                        pdbUrl = "/api/upload/pdb/" + inputId;
                        csvUrl = "/api/upload/csv/" + inputId;
                        seqUrl = "/api/upload/seq/" + inputId;
                    }
                    // Download pdb and create a model.
                    var model = plugin.createTransform()
                        .add(plugin.root, Transformer.Data.Download, { url: pdbUrl, type: 'String', id: inputType })
                        .then(Transformer.Molecule.CreateFromData, { format: LiteMol.Core.Formats.Molecule.SupportedFormats.PDB }, { isBinding: true })
                        .then(Transformer.Molecule.CreateModel, { modelIndex: 0 }, { ref: 'model' });
                    // Download and parse predictions.
                    model.add(plugin.root, Transformer.Data.Download, { url: csvUrl, type: 'String', id: 'predictions' }, { isHidden: true })
                        .then(Transformer.Data.ParseJson, { id: 'P2RANK Data' })
                        .then(PrankWeb.ParseAndCreatePrediction, {}, { ref: 'pockets', isHidden: true });
                    // Download and store sequence
                    model.add(plugin.root, Transformer.Data.Download, { url: seqUrl, type: 'String', id: 'sequence' }, { isHidden: true })
                        .then(Transformer.Data.ParseJson, { id: 'Sequence Data' })
                        .then(PrankWeb.CreateSequence, {}, { ref: 'sequence', isHidden: true });
                    plugin.applyTransform(model)
                        .then(function () {
                        var model = plugin.context.select('model')[0];
                        var prediction = plugin.context.select('pockets')[0];
                        var sequence = plugin.context.select('sequence')[0];
                        var mappings = initColorMapping(model, prediction, sequence);
                        DataLoader.setAtomColorMapping(plugin, model, mappings.atomColorMap);
                        DataLoader.setAtomColorMapping(plugin, model, mappings.atomColorMapConservation, true);
                        if (!prediction)
                            rej("Unable to load predictions.");
                        else if (!sequence)
                            rej("Unable to load protein sequence.");
                        else {
                            res({ model: model, prediction: prediction, sequence: sequence });
                        }
                    }).catch(function (e) { return rej(e); });
                });
            }
            DataLoader.loadData = loadData;
            function visualizeData(plugin, data) {
                return new LiteMol.Promise(function (res, rej) {
                    var pockets = data.prediction.props.pockets;
                    // Specify styles for visual.
                    var cartoonsColors = Bootstrap.Visualization.Molecule.UniformBaseColors;
                    var cartoonStyle = {
                        type: 'Cartoons', params: { detail: 'Automatic' },
                        theme: { template: Bootstrap.Visualization.Molecule.Default.UniformThemeTemplate, colors: cartoonsColors }
                    };
                    // Create color theme for pockets.
                    var surfaceColors = Bootstrap.Immutable.Map()
                        .set('Uniform', LiteMol.Visualization.Color.fromHex(0xffffff))
                        .set('Selection', LiteMol.Visualization.Theme.Default.SelectionColor)
                        .set('Highlight', LiteMol.Visualization.Theme.Default.HighlightColor);
                    // Style for protein surface.
                    var surfaceStyle = {
                        type: 'Surface',
                        params: { probeRadius: 0.55, density: 1.4, smoothing: 4, isWireframe: false },
                        theme: { template: Bootstrap.Visualization.Molecule.Default.UniformThemeTemplate, colors: surfaceColors, transparency: { alpha: 0.6 } }
                    };
                    // Style for water.
                    var ballsAndSticksStyle = {
                        type: 'BallsAndSticks',
                        params: { useVDW: false, atomRadius: 0.23, bondRadius: 0.09, detail: 'Automatic' },
                        theme: { template: Bootstrap.Visualization.Molecule.Default.ElementSymbolThemeTemplate, colors: Bootstrap.Visualization.Molecule.Default.ElementSymbolThemeTemplate.colors, transparency: { alpha: 0.25 } }
                    };
                    var action = plugin.createTransform();
                    // Create visuals for protein, ligand and water.
                    // Protein.
                    var polymer = action.add(data.model, Transformer.Molecule.CreateSelectionFromQuery, { query: LiteMol.Core.Structure.Query.nonHetPolymer(), name: 'Polymer', silent: true }, { isBinding: true, ref: 'polymer' });
                    polymer.then(Transformer.Molecule.CreateVisual, { style: cartoonStyle }, { ref: 'polymer-cartoon' });
                    polymer.then(Transformer.Molecule.CreateVisual, { style: surfaceStyle }, { ref: 'polymer-surface' });
                    // Ligand.
                    var het = action.add(data.model, Transformer.Molecule.CreateSelectionFromQuery, { query: LiteMol.Core.Structure.Query.hetGroups(), name: 'HET', silent: true }, { isBinding: true });
                    het.then(Transformer.Molecule.CreateVisual, { style: Bootstrap.Visualization.Molecule.Default.ForType.get('BallsAndSticks') });
                    // Water.
                    var water = action.add(data.model, Transformer.Molecule.CreateSelectionFromQuery, { query: LiteMol.Core.Structure.Query.entities({ type: 'water' }), name: 'Water', silent: true }, { isBinding: true });
                    water.then(Transformer.Molecule.CreateVisual, { style: ballsAndSticksStyle });
                    // Create a group for all pockets.
                    var pocketGroup = action.add(data.model, Transformer.Basic.CreateGroup, { label: 'Group', description: 'Pockets' });
                    // For each pocket create selections, but don't create any visuals for them. 
                    pockets.forEach(function (pocket, i) {
                        var query = Query.atomsById.apply(null, pocket.surfAtomIds);
                        // Create selection.
                        var sel = pocketGroup.then(Transformer.Molecule.CreateSelectionFromQuery, { query: query, name: pockets[i].name, silent: true }, { ref: pockets[i].name });
                        //sel.then(<any>Transformer.Molecule.CreateVisual, { style: Bootstrap.Visualization.Molecule.Default.ForType.get('BallsAndSticks') }, { isHidden: false });
                        //sel.then(<any>Transformer.Molecule.CreateVisual, { style: selectionStyle }, { isHidden: false });
                    });
                    plugin.applyTransform(action)
                        .then(function () { return res(data); })
                        .catch(function (e) { return rej(e); });
                });
            }
            DataLoader.visualizeData = visualizeData;
            function setAtomColorMapping(plugin, model, mapping, conservation) {
                if (conservation === void 0) { conservation = false; }
                var ctx = plugin.context;
                var cache = ctx.entityCache;
                var cacheId = conservation ? '__PrankWeb__atomColorMapping__conservation__' : '__PrankWeb__atomColorMapping__';
                cache.set(model, cacheId, mapping);
            }
            DataLoader.setAtomColorMapping = setAtomColorMapping;
            function getAtomColorMapping(plugin, model, conservation) {
                if (conservation === void 0) { conservation = false; }
                var ctx = plugin.context;
                var cache = ctx.entityCache;
                var cacheId = conservation ? '__PrankWeb__atomColorMapping__conservation__' : '__PrankWeb__atomColorMapping__';
                return cache.get(model, cacheId);
            }
            DataLoader.getAtomColorMapping = getAtomColorMapping;
            function colorProteinFuture(plugin, data) {
                return new LiteMol.Promise(function (res, rej) {
                    if (colorProtein(plugin)) {
                        res(data);
                    }
                    else {
                        rej("Mapping or model not found!");
                    }
                });
            }
            DataLoader.colorProteinFuture = colorProteinFuture;
            function colorProtein(plugin) {
                var model = plugin.context.select('model')[0];
                if (!model)
                    return false;
                var atomColorMapping = getAtomColorMapping(plugin, model);
                if (!atomColorMapping)
                    return false;
                var colorMap = LiteMol.Core.Utils.FastMap.create();
                var fallbackColor = LiteMol.Visualization.Color.fromHex(0xffffff); // white
                colorMap.set(0, fallbackColor);
                // Fill the color map with colors.
                PrankWeb.Colors.forEach(function (color, i) { return colorMap.set(i + 1, color); });
                for (var _i = 0, _a = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]; _i < _a.length; _i++) {
                    var shade = _a[_i];
                    var c = shade * 255;
                    colorMap.set(colorMap.size, LiteMol.Visualization.Color.fromRgb(c, c, c));
                }
                var colors = LiteMol.Core.Utils.FastMap.create();
                colors.set('Uniform', fallbackColor);
                colors.set('Selection', LiteMol.Visualization.Theme.Default.SelectionColor);
                colors.set('Highlight', LiteMol.Visualization.Theme.Default.HighlightColor);
                // Create mapping, theme and apply to all protein visuals.
                var mapping = LiteMol.Visualization.Theme.createColorMapMapping(function (i) { return atomColorMapping[i]; }, colorMap, fallbackColor);
                // make the theme "sticky" so that it persist "ResetScene" command.
                var themeTransparent = LiteMol.Visualization.Theme.createMapping(mapping, { colors: colors, isSticky: true, transparency: { alpha: 1 } });
                //const theme = Visualization.Theme.createMapping(mapping, { colors, isSticky: true });
                var surface = plugin.selectEntities(Bootstrap.Tree.Selection.byRef('polymer-surface').subtree().ofType(Bootstrap.Entity.Molecule.Visual))[0];
                //const cartoon = plugin.selectEntities(Bootstrap.Tree.Selection.byRef('polymer-cartoon').subtree().ofType(Bootstrap.Entity.Molecule.Visual))[0];
                plugin.command(Bootstrap.Command.Visual.UpdateBasicTheme, { visual: surface, theme: themeTransparent });
                //plugin.command(Bootstrap.Command.Visual.UpdateBasicTheme, { visual: cartoon as any, theme });
                return true;
            }
            DataLoader.colorProtein = colorProtein;
        })(DataLoader = PrankWeb.DataLoader || (PrankWeb.DataLoader = {}));
    })(PrankWeb = LiteMol.PrankWeb || (LiteMol.PrankWeb = {}));
})(LiteMol || (LiteMol = {}));
var LiteMol;
(function (LiteMol) {
    var PrankWeb;
    (function (PrankWeb) {
        var App;
        (function (App_1) {
            var React = LiteMol.Plugin.React;
            function render(plugin, inputType, inputId, target) {
                LiteMol.Plugin.ReactDOM.render(React.createElement(App, { plugin: plugin, inputType: inputType, inputId: inputId }), target);
            }
            App_1.render = render;
            var App = (function (_super) {
                __extends(App, _super);
                function App() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.state = { isLoading: false, data: void 0, error: void 0 };
                    return _this;
                }
                App.prototype.componentDidMount = function () {
                    this.load();
                };
                App.prototype.load = function () {
                    var _this = this;
                    this.setState({ isLoading: true, error: void 0 });
                    // Load data.
                    PrankWeb.DataLoader.loadData(this.props.plugin, this.props.inputType, this.props.inputId)
                        .then(function (data) { return PrankWeb.DataLoader.visualizeData(_this.props.plugin, data); })
                        .then(function (data) { return PrankWeb.DataLoader.colorProteinFuture(_this.props.plugin, data); })
                        .then(function (data) { return _this.setState({ isLoading: false, data: data }); })
                        .catch(function (e) { return _this.setState({ isLoading: false, error: '' + e }); });
                };
                App.prototype.render = function () {
                    var _this = this;
                    if (this.state.data) {
                        // Data available, display pocket list.
                        return React.createElement(PrankWeb.PocketList, { data: this.state.data, plugin: this.props.plugin });
                    }
                    else {
                        var controls = [];
                        if (this.state.isLoading) {
                            controls.push(React.createElement("h1", null, "Loading..."));
                        }
                        else {
                            // Offer a button to load data.
                            controls.push(React.createElement("button", { onClick: function () { return _this.load(); } }, "Load data"));
                            if (this.state.error) {
                                controls.push(React.createElement("div", { style: { color: 'red', fontSize: '18px' } },
                                    "Error: ",
                                    this.state.error));
                            }
                        }
                        return React.createElement("div", null, controls);
                    }
                };
                return App;
            }(React.Component));
            App_1.App = App;
        })(App = PrankWeb.App || (PrankWeb.App = {}));
    })(PrankWeb = LiteMol.PrankWeb || (LiteMol.PrankWeb = {}));
})(LiteMol || (LiteMol = {}));
var LiteMol;
(function (LiteMol) {
    var PrankWeb;
    (function (PrankWeb) {
        var Views = LiteMol.Plugin.Views;
        var Bootstrap = LiteMol.Bootstrap;
        var Transformer = Bootstrap.Entity.Transformer;
        var LayoutRegion = Bootstrap.Components.LayoutRegion;
        PrankWeb.PrankWebSpec = {
            settings: {},
            transforms: [
                // Molecule(model) transforms
                { transformer: Transformer.Molecule.CreateModel, view: Views.Transform.Molecule.CreateModel, initiallyCollapsed: true },
                { transformer: Transformer.Molecule.CreateSelection, view: Views.Transform.Molecule.CreateSelection, initiallyCollapsed: true },
                { transformer: Transformer.Molecule.CreateAssembly, view: Views.Transform.Molecule.CreateAssembly, initiallyCollapsed: true },
                { transformer: Transformer.Molecule.CreateSymmetryMates, view: Views.Transform.Molecule.CreateSymmetryMates, initiallyCollapsed: true },
                { transformer: Transformer.Molecule.CreateMacromoleculeVisual, view: Views.Transform.Empty },
                { transformer: Transformer.Molecule.CreateVisual, view: Views.Transform.Molecule.CreateVisual }
            ],
            behaviours: [
                // you will find the source of all behaviours in the Bootstrap/Behaviour directory
                Bootstrap.Behaviour.SetEntityToCurrentWhenAdded,
                Bootstrap.Behaviour.FocusCameraOnSelect,
                Bootstrap.Behaviour.UnselectElementOnRepeatedClick,
                // this colors the visual when a selection is created on it.
                //Bootstrap.Behaviour.ApplySelectionToVisual,
                // this colors the visual when it's selected by mouse or touch
                Bootstrap.Behaviour.ApplyInteractivitySelection,
                // this shows what atom/residue is the pointer currently over
                Bootstrap.Behaviour.Molecule.HighlightElementInfo,
                // when the same element is clicked twice in a row, the selection is emptied
                Bootstrap.Behaviour.UnselectElementOnRepeatedClick,
                // distance to the last "clicked" element
                Bootstrap.Behaviour.Molecule.DistanceToLastClickedElement,
                // when somethinh is selected, this will create an "overlay visual" of the selected residue and show every other residue within 5ang
                // you will not want to use this for the ligand pages, where you create the same thing this does at startup
                //Bootstrap.Behaviour.Molecule.ShowInteractionOnSelect(5),                
                // this tracks what is downloaded and some basic actions. Does not send any private data etc.
                // While it is not required for any functionality, we as authors are very much interested in basic 
                // usage statistics of the application and would appriciate if this behaviour is used.
                Bootstrap.Behaviour.GoogleAnalytics('UA-77062725-1')
            ],
            components: [
                LiteMol.Plugin.Components.Visualization.HighlightInfo(LayoutRegion.Main, true),
                LiteMol.Plugin.Components.Entity.Current('LiteMol', LiteMol.Plugin.VERSION.number)(LayoutRegion.Right, true),
                LiteMol.Plugin.Components.Transform.View(LayoutRegion.Right),
                //Plugin.Components.Context.Log(LayoutRegion.Bottom, true),
                LiteMol.Plugin.Components.create('PrankWeb.SequenceView', function (s) { return new PrankWeb.SequenceController(s); }, PrankWeb.SequenceView)(LayoutRegion.Top, true),
                LiteMol.Plugin.Components.Context.Overlay(LayoutRegion.Root),
                LiteMol.Plugin.Components.Context.Toast(LayoutRegion.Main, true),
                LiteMol.Plugin.Components.Context.BackgroundTasks(LayoutRegion.Main, true)
            ],
            viewport: {
                view: Views.Visualization.Viewport,
                controlsView: Views.Visualization.ViewportControls,
            },
            layoutView: Views.Layout,
            tree: { region: LayoutRegion.Left, view: Views.Entity.Tree }
        };
    })(PrankWeb = LiteMol.PrankWeb || (LiteMol.PrankWeb = {}));
})(LiteMol || (LiteMol = {}));
var LiteMol;
(function (LiteMol) {
    var PrankWeb;
    (function (PrankWeb) {
        var Plugin = LiteMol.Plugin;
        var Bootstrap = LiteMol.Bootstrap;
        function create(target) {
            var plugin = Plugin.create({
                target: target,
                viewportBackground: '#e7e7e7',
                layoutState: {
                    hideControls: true,
                    isExpanded: false,
                    collapsedControlsLayout: Bootstrap.Components.CollapsedControlsLayout.Landscape,
                },
                customSpecification: PrankWeb.PrankWebSpec
            });
            plugin.context.logger.message("LiteMol " + Plugin.VERSION.number);
            plugin.command(Bootstrap.Command.Layout.SetState, {
                regionStates: (_a = {}, _a[Bootstrap.Components.LayoutRegion.Top] = 'Sticky', _a)
            });
            return plugin;
            var _a;
        }
        PrankWeb.create = create;
        // Div that LiteMol mounts into.
        var appNode = document.getElementById('app');
        // Div that control panel mounts into.
        var pocketNode = document.getElementById('pocket-list');
        // Specify what data to display.
        var inputType = appNode.getAttribute("data-input-type");
        var inputId = appNode.getAttribute("data-input-id");
        PrankWeb.App.render(create(appNode), inputType, inputId, pocketNode);
    })(PrankWeb = LiteMol.PrankWeb || (LiteMol.PrankWeb = {}));
})(LiteMol || (LiteMol = {}));
