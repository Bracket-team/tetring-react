class Artifact {
    constructor( name, rarity, effect, address, logic) {
        this.name = name;
        this.rarity = rarity;
        this.effect = effect;
        this.address = address;
        this.logic = logic;
    }

    clone() {
    return new Artifact(
        this.name,
        this.rarity,
        this.effect,
        this.address,
        this.logic
        );
    }
}

const availableArtifacts = [
    new Artifact("노을 사진","Normal","하늘색, 노란색 블록 터트릴 때마다 +1 line score","../img/sunset.png"),
    new Artifact("T블록","Normal","보라색 블록 터트릴 때마다 +1.5 line score","../img/t.png"),
    new Artifact("보물 상자","Normal","싱글, 더블에 유물 개수 만큼 +line score를 더함","../img/treasure.png"),
    new Artifact("리롤 블록", "Normal", "리롤 비용 2$ 감소","../img/reroll.png"),
    new Artifact("재활용 블록","Normal","해당 유물을 획득할 시 블록 5개 추가","../img/recycle.png"),
    new Artifact("돈 주머니","Normal","라인을 터트릴 때마다 머니 레벨만큼 line score +1추가","../img/pocket.png"),
    new Artifact("초과 업무", "Normal", "초과 점수 1000점 당 +1$","../img/overtime.png"),
    new Artifact("금 블록","Normal","가지고 있는 10$당 싱글 달성 시 +2 line score 점","../img/golden.png"),
    new Artifact("은색 반지", "Normal", "스테이지에 실패할 경우 재도전","../img/revive.png"),
    new Artifact("쿠폰 블록","Normal","매 상점을 들릴 때마다 리롤 1회 무료","../img/coupon.png"),
    new Artifact("블록 망치", "Normal", "3회 블록 추가 건너띄기","../img/hammer.png"),
    new Artifact("딸기","Normal","연두색, 빨간색 블록 터트릴 때마다 +1 line score","../img/strawberry.png"),
    new Artifact("썩은 귤","Normal","파란색, 귤색 블록 터트릴 때마다 +1 line score","../img/corruption.png"),
    new Artifact("트리플 블록", "Normal", "트리플 +20 line score","../img/triple.png"),
    new Artifact("테트라 블록", "Normal", "테트리스 +40 line score","../img/tetra.png"),
    new Artifact("화이트 블록", "Rare", "모든 블록을 모든 색깔로 취급","../img/white.png"),
    new Artifact("다이아몬드","Rare","가지고 있는 15$당 라인 클리어 시 +1 combo score점","../img/diamond.png"),
    new Artifact("수표 블록","Rare","가지고 있는 돈의 두 배 획득(최대 30$)","../img/check.png"),
    new Artifact("흰색 해골","Rare","스테이지의 25%만 달성해도 다음 스테이지로 통과","../img/skeleton.png"),
    new Artifact("투자 블록","Rare","스테이지가 끝날 때마다 가지고 있는 4$ 당 +1$(최대 10$)","../img/invest.png"),
    new Artifact("클론", "Rare", "가지고 있는 무작위 유물의 능력을 복사","../img/clone.png"),
    new Artifact("심플 볼록","Rare","콤보 점수에 x1 배(더블 이상 없이 깬 스테이지 마다 +0.2 계수, 더블 이상 했을 시 초기화)","../img/simple.png"),
    new Artifact("콤보 블록","Rare","콤보 최대 1로 제한, 1콤보 시 +3 combo score","../img/combo.png"),
    new Artifact("먹보 블록","Rare","최종 콤보 점수에 x1 배(블록 추가할 때마다 +0.1계수)","../img/glutton.png"),
    new Artifact("파이브 블록","Rare","line score 500점 달성할 때마다 combo score x1.5","../img/five.png"),
    new Artifact("블랭크 블록", "Ultra", "한 줄에 9 칸만 채워져도 터짐","../img/blank.png"),
    new Artifact("별", "Ultra", "라인을 터트릴 때마다 +2 combo score","../img/star.png"),
    new Artifact("파괴 블록","Ultra","블록을 놓을 때마다 +7 line score (스테이지가 끝날 때마다 무작위 블록 유물 파괴한 후 +2 증가)","../img/destroy.png"),
    new Artifact("우산 블록","Ultra","블록을 7번째 놓을 때마다 밑에서 블록이 올라옴","../img/umbrella.png"),
    new Artifact("컨테이너 블록","Ultra","트리플을 할 때마다 combo score에 x1.25 배","../img/container.png"),
];