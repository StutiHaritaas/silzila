// Canvas component is part of Dataset Create / Edit page
// List of tables selected in sidebar is displayed here
// connections can be made between columns of different tables to define relationship in a dataset

import React, { useState } from "react";
import { connect } from "react-redux";
import "./Dataset.css";
import Xarrow, { Xwrapper } from "react-xarrows";
import CanvasTables from "./CanvasTables";
import RelationshipDefiningComponent from "./RelationshipDefiningComponent";
import BottomBar from "./BottomBar";
import {
	ArrowsProps,
	DataSetStateProps,
	tableObjProps,
} from "../../redux/DataSet/DatasetStateInterfacse";
import { CanvasProps } from "./CanvasInterfaces";

const Canvas = ({
	// state
	tempTable,
	arrows,
	//props
	editMode,
}: CanvasProps) => {
	console.log(tempTable, arrows);
	const [showRelationCard, setShowRelationCard] = useState<boolean>(false);
	const [existingArrowProp, setExistingArrowProp] = useState<{}>({});
	const [existingArrow, setExistingArrow] = useState<boolean>(false);

	// When arrow is clicked, open relationship Popover
	const clickOnArrowfunc = (index: number) => {
		setExistingArrow(true);
		//console.log(index);
		const temp = arrows.filter((el: ArrowsProps, i: number) => {
			return i === index;
		})[0];
		//console.log(temp);
		setExistingArrowProp(temp);
		setShowRelationCard(true);
	};

	// TODO need to specify type
	const RenderArrows: any = () => {
		return (
			arrows &&
			arrows.map((ar: ArrowsProps, index: number) => {
				return (
					<div
						className="arrowIcon"
						id="arr"
						onClick={() => clickOnArrowfunc(index)}
						key={index}
					>
						<Xarrow
							start={ar.start}
							end={ar.end}
							color="grey"
							strokeWidth={2}
							showHead={ar.showHead}
							showTail={ar.showTail}
							key={index}
						/>
					</div>
				);
			})
		);
	};

	return (
		<div className="canvas">
			<div className="canvasStyle" id="canvasTableArea">
				<Xwrapper>
					{tempTable &&
						tempTable.map((table: tableObjProps) => {
							return <CanvasTables tableData={table} key={table.id} />;
						})}
					<RenderArrows />
				</Xwrapper>
			</div>
			<BottomBar editMode={editMode ? editMode : false} />

			<RelationshipDefiningComponent
				id="idarrow"
				showRelationCard={showRelationCard}
				setShowRelationCard={setShowRelationCard}
				existingArrowProp={existingArrowProp}
				existingArrow={existingArrow}
				setExistingArrow={setExistingArrow}
				setExistingArrowProp={setExistingArrowProp}
			/>
		</div>
	);
};

const mapStateToProps = (state: DataSetStateProps, ownProps: any) => {
	return {
		tempTable: state.dataSetState.tempTable,
		arrows: state.dataSetState.arrows,
	};
};

export default connect(mapStateToProps, null)(Canvas);