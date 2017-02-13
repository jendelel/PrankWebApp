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
            description: 'Create protein sequence from JSON.',
            from: [Entity.Data.Json],
            to: [PrankWeb.SequenceEntity],
            defaultParams: function () { return ({}); }
        }, function (context, a, t) {
            return Bootstrap.Task.create("Create sequence entity", 'Normal', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ctx.updateProgress('Creating sequence entity...')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, PrankWeb.SequenceEntity.create(t, { label: "Sequence", seq: a.props.data })];
                    }
                });
            }); }).setReportTime(true);
        });
        var SequenceController = (function (_super) {
            __extends(SequenceController, _super);
            function SequenceController(context) {
                var _this = _super.call(this, context, { seq: { indices: [], seq: [], scores: [] }, pockets: [] }) || this;
                Bootstrap.Event.Tree.NodeAdded.getStream(context).subscribe(function (e) {
                    if (e.data.type === PrankWeb.SequenceEntity) {
                        _this.setState({
                            seq: e.data.props.seq, pockets: _this.latestState.pockets
                        });
                    }
                    else if (e.data.type === PrankWeb.Prediction) {
                        var ls = _this.latestState;
                        _this.setState({
                            seq: _this.latestState.seq, pockets: e.data.props.pockets
                        });
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
        var _this = this;
        var Bootstrap = LiteMol.Bootstrap;
        var Entity = Bootstrap.Entity;
        PrankWeb.Prediction = Entity.create({
            name: 'Pocket prediction',
            typeClass: 'Data',
            shortName: 'PP',
            description: 'Represents predicted protein-ligand binding pockets.'
        });
        PrankWeb.Colors = Bootstrap.Immutable.List.of(LiteMol.Visualization.Color.fromHexString("#e74c3c"), LiteMol.Visualization.Color.fromHexString("#00ffff"), LiteMol.Visualization.Color.fromHexString("#2ecc71"), LiteMol.Visualization.Color.fromHexString("#9b59b6"), LiteMol.Visualization.Color.fromHexString("#00007f"), LiteMol.Visualization.Color.fromHexString("#e67e22"));
        PrankWeb.ParseAndCreatePrediction = Bootstrap.Tree.Transformer.create({
            id: 'protein-pocket-prediction-parse',
            name: 'Protein predicted pockets',
            description: 'Parse protein pocket prediction.',
            from: [Entity.Data.Json],
            to: [PrankWeb.Prediction],
            defaultParams: function () { return ({}); }
        }, function (context, a, t) {
            return Bootstrap.Task.create("Parse protein prediction entity.", 'Normal', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                var pockets;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ctx.updateProgress('Parsing prediction data...')];
                        case 1:
                            _a.sent();
                            pockets = a.props.data;
                            return [2 /*return*/, PrankWeb.Prediction.create(t, { label: 'Sequence', pockets: pockets })];
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
            function Feature(cat, typ, start, end, text) {
                this.category = cat;
                this.type = typ;
                this.start = start;
                this.end = end;
                this.text = text;
            }
            return Feature;
        }());
        var SequenceView = (function (_super) {
            __extends(SequenceView, _super);
            function SequenceView() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SequenceView.prototype.getResidue = function (seqNumber, model) {
                var ctx = this.controller.context;
                var cache = ctx.entityCache;
                var cacheId = "__resSelectionInfo-" + seqNumber;
                var item = cache.get(model, cacheId);
                if (!item) {
                    var selectionQ = LiteMol.Core.Structure.Query.residuesById(seqNumber); //Core.Structure.Query.chains({ authAsymId: 'A' })
                    var elements = LiteMol.Core.Structure.Query.apply(selectionQ, model.props.model).unionAtomIndices();
                    var selection = Bootstrap.Interactivity.Info.selection(model, elements);
                    var selectionInfo = Bootstrap.Interactivity.Molecule.transformInteraction(selection);
                    item = new CacheItem(selectionQ, selectionInfo);
                    cache.set(model, cacheId, item);
                }
                return item;
            };
            SequenceView.prototype.addPocketFeatures = function (features) {
                // Build hashmap index->sequential index zero-based.
                var map = LiteMol.Core.Utils.FastMap.create();
                this.controller.latestState.seq.indices.forEach(function (index, seqIndex) {
                    map.set(index, seqIndex);
                });
                var pockets = this.controller.latestState.pockets;
                pockets.forEach(function (pocket, i) {
                    // Transform indices to sequential indices and then sort them.
                    var sortedIndices = pocket.residueIds.map(function (index) {
                        return map.get(index);
                    }).sort(function (a, b) { return a - b; });
                    var lastStart = -1;
                    var lastResNum = -1;
                    sortedIndices.forEach(function (resNum, y) {
                        if (y == 0) {
                            lastStart = resNum;
                        }
                        else {
                            if (lastResNum + 1 < resNum) {
                                features.push(new Feature("Pockets", "pocket" + i + " col" + i % 6, lastStart, lastResNum, pocket.rank.toString()));
                                lastStart = resNum;
                            }
                        }
                        lastResNum = resNum;
                    });
                    features.push(new Feature("Pockets", "col" + i % 6, lastStart, lastResNum, pocket.rank.toString()));
                });
            };
            SequenceView.prototype.componentDidMount = function () {
                this.componentDidUpdate();
            };
            SequenceView.prototype.componentDidUpdate = function () {
                var seq = this.controller.latestState.seq;
                if (seq.seq.length <= 0)
                    return; // Sequence isn't loaded yet.
                //this.scrollToBottom();
                var pockets = this.controller.latestState.pockets;
                var pviz = getPviz();
                var seqEntry = new pviz.SeqEntry({ sequence: seq.seq.join("") });
                new pviz.SeqEntryAnnotInteractiveView({
                    model: seqEntry, el: '#seqView',
                    xChangeCallback: function (pStart, pEnd) {
                        // this.onLetterMouseEnter(Math.round(pStart));
                    }
                }).render();
                var features = [];
                this.addPocketFeatures(features);
                // Conservation features
                var scores = seq.scores;
                if (scores != null && scores.length > 0) {
                    scores.forEach(function (score, i) {
                        var s = score >= 0 ? score : 0;
                        var s2 = Math.round(s * 10); // There are 11 shades of gray with selector score0, score1, ..., score10
                        features.push(new Feature("Conservation", "score" + s2, i, i, (Math.round(s * 100) / 100).toString()));
                    });
                }
                seqEntry.addFeatures(features);
            };
            SequenceView.prototype.onLetterMouseEnter = function (seqNumber) {
                var ctx = this.controller.context;
                var model = ctx.select('model')[0];
                if (!model)
                    return;
                // Get the sequence selection
                var seqSel = this.getResidue(seqNumber, model);
                // Highlight in the 3D Visualization
                if (this.lastSelectedSeq) {
                    Bootstrap.Command.Molecule.Highlight.dispatch(ctx, { model: model, query: this.lastSelectedSeq.query, isOn: false });
                }
                Bootstrap.Command.Molecule.Highlight.dispatch(ctx, { model: model, query: seqSel.query, isOn: true });
                this.lastSelectedSeq = seqSel;
                // if (isOn) {
                // Show tooltip
                var label = Bootstrap.Interactivity.Molecule.formatInfo(seqSel.selectionInfo);
                Bootstrap.Event.Interactivity.Highlight.dispatch(ctx, [label /*, 'some additional label'*/]);
                // } else {
                // Hide tooltip
                // Bootstrap.Event.Interactivity.Highlight.dispatch(ctx, [])
                // }
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
                return React.createElement("div", { id: "seqView", className: "noselect" });
            };
            return SequenceView;
        }(Views.View));
        PrankWeb.SequenceView = SequenceView;
    })(PrankWeb = LiteMol.PrankWeb || (LiteMol.PrankWeb = {}));
})(LiteMol || (LiteMol = {}));
var LiteMol;
(function (LiteMol) {
    var PrankWeb;
    (function (PrankWeb) {
        var Bootstrap = LiteMol.Bootstrap;
        var React = LiteMol.Plugin.React; // this is to enable the HTML-like syntax
        var PocketController = (function (_super) {
            __extends(PocketController, _super);
            function PocketController(context) {
                var _this = _super.call(this, context, { pockets: [] }) || this;
                Bootstrap.Event.Tree.NodeAdded.getStream(context).subscribe(function (e) {
                    if (e.data.type === PrankWeb.Prediction) {
                        _this.setState({ pockets: e.data.props.pockets });
                    }
                });
                return _this;
            }
            return PocketController;
        }(Bootstrap.Components.Component));
        PrankWeb.PocketController = PocketController;
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
            PocketList.prototype.getPocket = function (pocket, model) {
                var ctx = this.props.plugin.context;
                var cache = ctx.entityCache;
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
            PocketList.prototype.componentDidUpdate = function () {
                //this.scrollToBottom();
            };
            PocketList.prototype.onLetterMouseEnter = function (pocket, isOn) {
                var ctx = this.props.plugin.context;
                var model = ctx.select('model')[0];
                if (!model)
                    return;
                // Get the sequence selection
                var pocketSel = this.getPocket(pocket, model);
                // Highlight in the 3D Visualization
                Bootstrap.Command.Molecule.Highlight.dispatch(ctx, { model: model, query: pocketSel.query, isOn: isOn });
                if (isOn) {
                    // Show tooltip
                    var label = Bootstrap.Interactivity.Molecule.formatInfo(pocketSel.selectionInfo);
                    Bootstrap.Event.Interactivity.Highlight.dispatch(ctx, [label, "" + pocket.name]);
                }
                else {
                    // Hide tooltip
                    Bootstrap.Event.Interactivity.Highlight.dispatch(ctx, []);
                }
            };
            PocketList.prototype.onLetterClick = function (pocket) {
                var ctx = this.props.plugin.context;
                var model = ctx.select('model')[0];
                if (!model)
                    return;
                var query = this.getPocket(pocket, model).query;
                Bootstrap.Command.Molecule.FocusQuery.dispatch(ctx, { model: model, query: query });
            };
            PocketList.prototype.render = function () {
                var _this = this;
                var pockets = this.props.data.prediction.props.pockets;
                var ctx = this.props.plugin.context;
                var colorToString = function (color) {
                    return 'rgb(' + (color.r * 255) + ',' + (color.g * 255) + ',' + (color.b * 255) + ')';
                };
                return (React.createElement("div", { className: "pocket-list" }, pockets.map(function (pocket, i) {
                    return React.createElement("div", { className: "pocket col-sm-6 col-xs-12", style: { borderColor: colorToString(PrankWeb.Colors.get(i % 6)) }, onMouseEnter: _this.onLetterMouseEnter.bind(_this, pocket, true), onMouseLeave: _this.onLetterMouseEnter.bind(_this, pocket, false), onClick: _this.onLetterClick.bind(_this, pocket) },
                        React.createElement("dl", null,
                            React.createElement("dt", null, "Pocket name"),
                            React.createElement("dd", null, pocket.name),
                            React.createElement("dt", null, "Pocket rank"),
                            React.createElement("dd", null, pocket.rank),
                            React.createElement("dt", null, "Pocket score"),
                            React.createElement("dd", null, pocket.score)));
                })));
            };
            return PocketList;
        }(React.Component));
        PrankWeb.PocketList = PocketList;
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
                    // Download mmcif and create model
                    var model = plugin.createTransform()
                        .add(plugin.root, Transformer.Data.Download, { url: pdbUrl, type: 'String', id: inputType })
                        .then(Transformer.Molecule.CreateFromData, { format: LiteMol.Core.Formats.Molecule.SupportedFormats.PDB }, { isBinding: true })
                        .then(Transformer.Molecule.CreateModel, { modelIndex: 0 }, { ref: 'model' });
                    // Download and parse predictions
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
                        if (!prediction)
                            rej("Unable to load predictions.");
                        else if (!sequence)
                            rej("Unable to load protein sequence.");
                        else {
                            res({ plugin: plugin, data: { model: model, prediction: prediction, sequence: sequence } });
                        }
                    }).catch(function (e) { return rej(e); });
                });
            }
            DataLoader.loadData = loadData;
            function visualizeData(plugin, data) {
                return new LiteMol.Promise(function (res, rej) {
                    var pockets = data.prediction.props.pockets;
                    /**
                     * Selection of a specific set of atoms...
                     */
                    var selectionQueries = [];
                    var allPocketIds = [];
                    pockets.forEach(function (pocket) {
                        selectionQueries.push(Query.atomsById.apply(null, pocket.surfAtomIds));
                        pocket.surfAtomIds.forEach(function (id) { allPocketIds.push(id); });
                        // __LiteMolReact.__DOM.render(__LiteMolReact.createElement('p', {}, 'Ahoj'), pocketNode)   
                    });
                    var selectionColors = Bootstrap.Immutable.Map()
                        .set('Uniform', LiteMol.Visualization.Color.fromHex(0xff0000))
                        .set('Selection', LiteMol.Visualization.Theme.Default.SelectionColor)
                        .set('Highlight', LiteMol.Visualization.Theme.Default.HighlightColor);
                    /**
                     * Selection of the complement of the previous set.
                     */
                    var complementQ = Query.atomsById.apply(null, allPocketIds).complement();
                    var complementColors = selectionColors.set('Uniform', LiteMol.Visualization.Color.fromHex(0x666666));
                    var complementStyle = {
                        type: 'Surface',
                        params: { probeRadius: 0.5, density: 1.4, smoothing: 4, isWireframe: false },
                        theme: { template: Bootstrap.Visualization.Molecule.Default.UniformThemeTemplate, colors: complementColors, transparency: { alpha: 1.0 } }
                    };
                    // Represent an action to perform on the app state.
                    var action = plugin.createTransform();
                    // Create a selection on the model and then create a visual for it...
                    action
                        .add(data.model, Transformer.Molecule.CreateSelectionFromQuery, { query: complementQ, name: 'Protein complement', silent: true }, {})
                        .then(Transformer.Molecule.CreateVisual, { style: complementStyle }, { isHidden: false });
                    // For each pocket:
                    selectionQueries.forEach(function (selectionQuery, i) {
                        // Set selection style (i.e. color, probe, density etc.)
                        var selectionColor = selectionColors.set('Uniform', PrankWeb.Colors.get(i % 6));
                        var selectionStyle = {
                            type: 'Surface',
                            params: { probeRadius: 0.5, density: 1.25, smoothing: 3, isWireframe: false },
                            theme: { template: Bootstrap.Visualization.Molecule.Default.UniformThemeTemplate, colors: selectionColor, transparency: { alpha: 0.8 } }
                        };
                        // Create selection and create visual (surface and ball and sticks)
                        var sel = action.add(data.model, Transformer.Molecule.CreateSelectionFromQuery, { query: selectionQuery, name: pockets[i].name, silent: true }, { ref: pockets[i].name });
                        sel.then(Transformer.Molecule.CreateVisual, { style: Bootstrap.Visualization.Molecule.Default.ForType.get('BallsAndSticks') }, { isHidden: false });
                        sel.then(Transformer.Molecule.CreateVisual, { style: selectionStyle }, { isHidden: false });
                    });
                    plugin.applyTransform(action);
                    res(data);
                });
            }
            DataLoader.visualizeData = visualizeData;
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
                    // Try to load data
                    PrankWeb.DataLoader.loadData(this.props.plugin, this.props.inputType, this.props.inputId)
                        .then(function (val) { return PrankWeb.DataLoader.visualizeData(val.plugin, val.data); })
                        .then(function (data) { return _this.setState({ isLoading: false, data: data }); })
                        .catch(function (e) { return _this.setState({ isLoading: false, error: '' + e }); });
                };
                App.prototype.render = function () {
                    var _this = this;
                    if (this.state.data) {
                        // Display pocket list
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
                                // Display error message.
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
                controlsView: Views.Visualization.ViewportControls
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
        function create(target) {
            var plugin = LiteMol.Plugin.create({
                target: target,
                //viewportBackground: '#333',
                layoutState: {
                    hideControls: false,
                    isExpanded: false,
                },
                customSpecification: PrankWeb.PrankWebSpec
            });
            plugin.context.logger.message("LiteMol " + LiteMol.Plugin.VERSION.number);
            return plugin;
        }
        PrankWeb.create = create;
        var appNode = document.getElementById('app');
        var inputType = appNode.getAttribute("data-input-type");
        var inputId = appNode.getAttribute("data-input-id");
        PrankWeb.App.render(create(appNode), inputType, inputId, document.getElementById('pockets'));
        /* let command = () => {
               Bootstrap.Command.Entity.SetVisibility.dispatch(e.tree!.context, { entity: e, visible: e.state.visibility === BEntity.Visibility.Full ? false : true });
         }*/
    })(PrankWeb = LiteMol.PrankWeb || (LiteMol.PrankWeb = {}));
})(LiteMol || (LiteMol = {}));
